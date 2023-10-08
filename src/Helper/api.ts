import { ElectronAPI } from "../../electron/preload";

const electronWindow = window as Window & typeof globalThis & { electronAPI?: ElectronAPI };

export function invokePSCommand(request: InvokePSCommandRequest): Promise<Loadable<PSDataSet>> {
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
      } as Loadable<PSDataSet>);
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
