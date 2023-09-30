import { ElectronAPI } from "../../electron/preload";

export async function invokePSCommand(request: InvokePSCommandRequest) {
  const electronWindow = window as Window & typeof globalThis & { electronAPI: ElectronAPI };
  return electronWindow.electronAPI.invokePSCommand(request);
}
