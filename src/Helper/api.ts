import { ElectronAPI } from "../../electron/preload";
import { defaultEnvironment } from "../Config/default";
import { useLocalStorage, useSessionStorage } from "../Hooks/useStorage";

const electronWindow = window as Window & typeof globalThis & { electronAPI?: ElectronAPI };

export async function invokePSCommand(
  request: InvokePSCommandRequest,
): Promise<Loadable<PSDataSet>> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          result: {
            columns: ["Age", "Name", "Location"],
            data: [
              { __id__: 1, Age: 20, Name: "John", Location: "USA" },
              { __id__: 2, Age: 30, Name: "Jane", Location: "UK" },
              { __id__: 3, Age: 40, Name: "Joe", Location: "Canada" },
              {
                __id__: 4,
                Age: 50,
                Name: "Jilllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
                Location: "Australia",
              },
              { __id__: 5, Age: 60, Name: "Jack", Location: "New Zealand" },
            ],
          },
          timestamp: Date.now(),
          executionTime: 0,
        });
      }, 1000);
    });
  }

  return electronWindow.electronAPI.invokePSCommand(request);
}

export function changeWindowState(state: WindowState) {
  if (!electronWindow.electronAPI) {
    return;
  }

  return electronWindow.electronAPI.changeWindowState(state);
}

export function useEnvironment(): ElectronEnvironment {
  const [env, setEnv] = useSessionStorage<ElectronEnvironment>(
    "cache_environment",
    defaultEnvironment,
  );

  if (!electronWindow.electronAPI) {
    return {
      executingUser: "API\\NOTFOUND",
      appVersion: "v0.0.0",
      appChannel: "stable",
    };
  }

  if (env === defaultEnvironment) {
    electronWindow.electronAPI.getEnvironment().then(setEnv);
  }

  return env;
}

export function useQueryDomains(): string[] {
  const [suffixList, setSuffixList] = useLocalStorage<string[]>("preferences_queryDomains", []);

  if (!electronWindow.electronAPI) {
    return ["domain1.com", "domain2.com", "domain3.com"];
  }

  if (suffixList.length === 0) {
    electronWindow.electronAPI.getDnsSuffixList().then(setSuffixList);
  }

  return suffixList;
}
