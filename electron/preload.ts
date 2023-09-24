import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<Loadable<JSONValue>> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
});
