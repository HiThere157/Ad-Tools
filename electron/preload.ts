import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<Loadable<PSDataSet>> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
});
