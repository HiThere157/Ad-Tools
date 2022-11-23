import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "./indexedDB";

type ElectronAPI = Window &
  typeof globalThis & {
    electronAPI: {
      getExecutingUser: () => { output: string };
      executeCommand: (
        command: Commands,
        args: CommandArgs,
        useStaticSession?: boolean
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
};

type Commands =
  | "Get-ADObject"
  | "Get-ADUser"
  | "Get-ADGroup"
  | "Get-ADGroupMember"
  | "Get-ADComputer"
  | "Resolve-DnsName";

type ResultData = {
  output?: { [key: string]: any }[];
  error?: string;
};

async function saveToDB(item: any) {
  const db = setupIndexedDB(commandDBConfig);
  const commandStore = new Store(db, "commands", "readwrite");
  commandStore.add(item);
  commandStore.deleteOld(500);
}

async function makeAPICall(
  command: Commands,
  args: CommandArgs,
  postProcessor: Function | Function[] = (AdObject: object) => {
    return AdObject;
  },
  callback: Function | Function[] = () => {}
) {
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
      args
    );

    saveToDB({
      command,
      args,
      date: new Date().toISOString().replace("T", " ").replace("Z", " UTC"),
    });

    if (result.error) {
      throw result.error;
    }

    callBackList.forEach(async (callback, index) => {
      callback({
        output: await postProcessorList[index](result.output),
      });
    });

    return true;
  } catch (error: any) {
    callBackList.forEach((callback) => {
      callback({
        output: [],
        error: error.toString(),
      });
    });
    return false;
  }
}

// Wrap all Properties in {key: [key], value: [value]} objects (attributes table)
function getPropertiesWrapper(AdObject: {
  PropertyNames: string[];
  [key: string]: string[];
}): { [key: string]: any } {
  return AdObject.PropertyNames.map((property) => {
    return { key: property, value: AdObject[property] };
  });
}

// Get Memberof Property from Get-AdUser Output and extract information
function getMembershipFromAdUser(AdObject: {
  MemberOf: string[];
  PrimaryGroup: string;
}): { Name: string; DistinguishedName: string }[] {
  const getCN = (dn: string) => {
    const cn = dn.split(",").filter((unit) => unit.startsWith("CN="))[0];
    return cn?.split("=")[1] ?? "";
  };

  const MemberOf = [...AdObject.MemberOf];
  if (AdObject.PrimaryGroup) MemberOf.push(AdObject.PrimaryGroup);

  return MemberOf.map((group) => {
    return { Name: getCN(group), DistinguishedName: group };
  });
}

async function prepareDNSResult(
  DNSObjects: { Type: number } | { Type: number }[]
): Promise<
  {
    Type: number;
    __friendlyType__: string;
    __result__: string;
    __connection__: string;
  }[]
> {
  const typeLookup: { [key: number]: { l: string; key: string | string[] } } = {
    1: { l: "A", key: "IPAddress" },
    2: { l: "NS", key: "NameHost" },
    6: { l: "SOA", key: ["PrimaryServer", "Administrator", "Name"] },
    12: { l: "PTR", key: "NameHost" },
    15: { l: "MX", key: "NameExchange" },
    16: { l: "TXT", key: "Text" },
    28: { l: "AAAA", key: "IPAddress" },
  };

  return Promise.all(
    makeToList(DNSObjects).map(async (record: any) => {
      let result;
      let connection = "";

      const resultKey = typeLookup[record.Type]?.key;
      if (!Array.isArray(resultKey)) {
        result = record[resultKey] ?? "";
      } else {
        result = Object.fromEntries(
          Object.entries(record).filter(([key]) => resultKey.includes(key))
        );
      }

      if (["A", "NS", "AAAA", "PTR"].includes(typeLookup[record.Type]?.l)) {
        connection = (
          await (window as ElectronAPI).electronAPI.probeConnection(result)
        ).output
          ? "True"
          : "False";
      }

      return {
        ...record,
        __friendlyType__:
          typeLookup[record.Type]?.l ?? `Unknown (${record.Type})`,
        __result__: result,
        __connection__: connection,
      };
    })
  );
}

function makeToList(AdObject: any[] | any): any[] {
  if (!Array.isArray(AdObject)) {
    return [AdObject];
  }
  return AdObject;
}

export {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
  prepareDNSResult,
  makeToList,
};
export type { ElectronAPI, ResultData };
