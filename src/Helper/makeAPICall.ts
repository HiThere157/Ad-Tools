import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "./indexedDB";
import { makeToList } from "./postProcessors";

type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI: {
      getExecutingUser: () => { output: string };
      executeCommand: (
        command: Commands,
        args: CommandArgs,
        useStaticSession?: boolean,
        json?: boolean
      ) => ResultData;
      probeConnection: (target: string) => ResultData;
      handleZoomUpdate: (callback: Function) => void;
      removeZoomListener: () => void;
    };
  };

type CommandArgs = {
  Filter?: string;
  Identity?: string;
  Server?: string;
  Properties?: string;
  Name?: string;
  Type?: string;
  Tenant?: string;
  ObjectId?: string;
  SearchString?: string;
  All?: string;
};

type Commands =
  | "Get-ADObject"
  | "Get-ADUser"
  | "Get-ADGroup"
  | "Get-ADGroupMember"
  | "Get-ADComputer"
  | "Resolve-DnsName"
  | "Connect-AzureAD"
  | "Get-AzureADCurrentSessionInfo"
  | "Get-AzureADUser"
  | "Get-AzureADUserMembership"
  | "Get-AzureADGroup"
  | "Get-AzureADGroupMember";

type ResultData = {
  output?: { [key: string]: any }[];
  error?: string;
};

type APICallParams = {
  command: Commands,
  args?: CommandArgs,
  postProcessor?: Function | Function[]
  callback?: Function | Function[],
  useStaticSession?: boolean,
  json?: boolean
}

async function saveToDB(item: any) {
  const db = setupIndexedDB(commandDBConfig);
  const commandStore = new Store(db, "commands", "readwrite");
  commandStore.add(item);
  commandStore.deleteOld(500);
}

export default async function makeAPICall({
  command,
  args = {},
  postProcessor = (AdObject: object) => {
    return AdObject;
  },
  callback = () => { },
  useStaticSession = false,
  json = true
}: APICallParams): Promise<ResultData> {
  const postProcessorList = makeToList(postProcessor);
  const callBackList = makeToList(callback);

  callBackList.forEach((callback) => {
    callback({
      output: [],
    });
  });

  try {
    const result = await (window as ElectronAPI).electronAPI.executeCommand(
      command,
      args,
      useStaticSession,
      json
    );

    saveToDB({
      command,
      args,
      date: new Date().toISOString().replace("T", " ").replace("Z", " UTC"),
    });

    if (result.error) {
      throw result.error;
    }

    const processed = postProcessorList.map(async (postProcessor) => {
      return postProcessor(result.output)
    });
    callBackList.forEach(async (callback, index) => {
      callback({
        output: await processed[index],
      });
    });
    await Promise.all(processed);

    return { output: processed };
  } catch (error: any) {
    const result = {
      output: [],
      error: error.toString(),
    };

    callBackList.forEach((callback) => {
      callback(result);
    });
    return result;
  }
}

export type { ElectronAPI, ResultData };
