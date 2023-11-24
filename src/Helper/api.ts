import { ElectronAPI } from "../../electron/preload";

export const electronWindow = window as Window & typeof globalThis & { electronAPI?: ElectronAPI };

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

export async function getEnvironment(): Promise<ElectronEnvironment> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          executingUser: "API\\NOTFOUND",
          appVersion: "v0.0.0",
          appChannel: "stable",
        });
      }, 1000);
    });
  }

  return electronWindow.electronAPI.getEnvironment();
}

export async function getDnsSuffixList(): Promise<string[]> {
  if (!electronWindow.electronAPI) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["domain1.com", "domain2.com", "domain3.com"]);
      }, 1000);
    });
  }

  return electronWindow.electronAPI.getDnsSuffixList();
}
