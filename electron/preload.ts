import { contextBridge, ipcRenderer } from "electron";

const api = {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<DataSet> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
  getElectronEnvironment: async (): Promise<ElectronEnvironment> =>
    ipcRenderer.invoke("node:getElectronEnvironment"),
  setWindowState: (state: WindowState) => ipcRenderer.send("win:setWindowState", state),
  setZoom: (zoom: number) => ipcRenderer.send("win:setZoom", zoom),
  checkForUpdates: () => ipcRenderer.send("update:checkForUpdates"),

  onDownloadStatusUpdate: (callback: (status: UpdateDownloadStatus) => void) =>
    ipcRenderer.on("update:onDownloadStatusUpdate", (_event, status: UpdateDownloadStatus) =>
      callback(status),
    ),
  offDownloadStatusUpdate: () => ipcRenderer.removeAllListeners("update:onDownloadStatusUpdate"),
};

export type ElectronAPI = typeof api;

contextBridge.exposeInMainWorld("electronAPI", api);
