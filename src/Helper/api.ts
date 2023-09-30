import { ElectronAPI } from "../../electron/preload";

const electronWindow = window as Window & typeof globalThis & { electronAPI?: ElectronAPI };

export function invokePSCommand(request: InvokePSCommandRequest) {
  if (!electronWindow.electronAPI) {
    return {
      error: "Electron API not found",
      timestamp: Date.now(),
      executionTime: 0,
    } as Loadable<PSDataSet>;
  }

  return electronWindow.electronAPI.invokePSCommand(request);
}

export function changeWindowState(state: WindowState) {
  if (!electronWindow.electronAPI) {
    return;
  }

  return electronWindow.electronAPI.changeWindowState(state);
}
