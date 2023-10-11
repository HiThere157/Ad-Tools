import { ElectronAPI } from "../../electron/preload";

const electronWindow = window as Window & typeof globalThis & { electronAPI?: ElectronAPI };

export async function invokePSCommand(
  request: InvokePSCommandRequest,
): Promise<Loadable<PSDataSet>> {
  const env = process.env.NODE_ENV;

  if (!electronWindow.electronAPI) {
    if (env === "development") {
      // Return some fake data for development
      return Promise.resolve({
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
    }

    return Promise.resolve({
      error: "Electron API not found",
      timestamp: Date.now(),
      executionTime: 0,
    } as Loadable<PSDataSet>);
  }

  return electronWindow.electronAPI.invokePSCommand(request);
}

export function changeWindowState(state: WindowState) {
  if (!electronWindow.electronAPI) {
    return;
  }

  return electronWindow.electronAPI.changeWindowState(state);
}

let cachedEnvironment: ElectronEnvironment | undefined;
export async function getEnvironment(): Promise<ElectronEnvironment> {
  if (!electronWindow.electronAPI) {
    return Promise.resolve({
      executingUser: "NOTFOUND\\WEB",
      dnsSuffixList: [],
      appVersion: "v0.0.0",
      appChannel: "stable",
    });
  }

  if (cachedEnvironment) {
    return Promise.resolve(cachedEnvironment);
  }

  const environment = await electronWindow.electronAPI.getEnvironment();
  cachedEnvironment = environment;
  return environment;
}
