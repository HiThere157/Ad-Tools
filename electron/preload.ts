import { contextBridge, ipcRenderer } from "electron";

const api = {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<Loadable<PSDataSet>> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
  getEnvironment: async (): Promise<ElectronEnvironment> =>
    ipcRenderer.invoke("node:getEnvironment"),
  changeWindowState: (state: WindowState) => ipcRenderer.send("win:changeWindowState", state),
};

export type ElectronAPI = typeof api;

contextBridge.exposeInMainWorld("electronAPI", api);
