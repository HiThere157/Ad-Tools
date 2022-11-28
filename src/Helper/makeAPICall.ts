import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "./indexedDB";
import { makeToList } from "./postProcessors";

import { ElectronAPI, Command, CommandArgs, ResultData } from "../Types/api";

async function saveToDB(item: any) {
  const db = setupIndexedDB(commandDBConfig);
  const commandStore = new Store(db, "commands", "readwrite");
  commandStore.add(item);
  commandStore.deleteOld(500);
}

type makeAPICallParams = {
  command: Command;
  args?: CommandArgs;
  postProcessor?: Function | Function[];
  callback?: Function | Function[];
  selectFields?: string[];
  useStaticSession?: boolean;
  json?: boolean;
};
export default async function makeAPICall({
  command,
  args = {},
  postProcessor = (AdObject: object) => AdObject,
  callback = () => { },
  selectFields = [],
  useStaticSession = false,
  json = true,
}: makeAPICallParams): Promise<ResultData> {
  const postProcessorList = makeToList(postProcessor);
  const callBackList = makeToList(callback);

  callBackList.forEach((callback) => {
    callback({ output: [] });
  });

  try {
    const result = await (window as ElectronAPI).electronAPI.executeCommand({
      command,
      args,
      selectFields,
      useStaticSession,
      json,
    });

    saveToDB({
      command,
      args,
      date: new Date().toISOString().replace("T", " ").replace("Z", " UTC"),
      success: !result.error
    });

    if (result.error) {
      throw result.error;
    }

    const processed = postProcessorList.map(async (postProcessor) => {
      return postProcessor(result.output);
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
