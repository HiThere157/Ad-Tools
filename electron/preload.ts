import { contextBridge, ipcRenderer } from "electron";

const api = {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<Loadable<PSDataSet>> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
};
export type ElectronAPI = typeof api;

contextBridge.exposeInMainWorld("electronAPI", api);
