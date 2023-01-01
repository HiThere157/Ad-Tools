import { commandDBConfig } from "../Config/default";
import { setupIndexedDB, Store } from "./indexedDB";
import { makeToList } from "./postProcessors";

const electronAPI = (window as ElectronAPI).electronAPI;

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
async function makeAPICall<T>({
  command,
  args = {},
  postProcessor = (AdObject: PSResult) => AdObject,
  callback = () => {},
  selectFields = [],
  useStaticSession = false,
  json = true,
}: makeAPICallParams): Promise<Result<Promise<T>[]>> {
  const postProcessorList = makeToList(postProcessor);
  const callBackList = makeToList(callback);

  callBackList.forEach((callback) => {
    callback({ output: [] });
  });

  try {
    const result = await electronAPI?.executeCommand<T>({
      command,
      args,
      selectFields,
      useStaticSession,
      json,
    });

    if (!result) {
      throw new Error("electronAPI not exposed.");
    }

    saveToDB({
      command,
      args,
      date: new Date().toISOString().replace("T", " ").replace("Z", " UTC"),
      success: !result.error,
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

    const resolvedProcessed = await Promise.all(processed);
    return { output: resolvedProcessed };
  } catch (error: any) {
    const result = {
      error: error.toString(),
    };

    callBackList.forEach((callback) => {
      callback(result);
    });
    return result;
  }
}

export { makeAPICall, electronAPI };
