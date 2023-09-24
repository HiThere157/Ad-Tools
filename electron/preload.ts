import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<Loadable<PSResult>> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
});
