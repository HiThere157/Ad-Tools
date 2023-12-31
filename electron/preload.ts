import { contextBridge, ipcRenderer } from "electron";

const api = {
  invokePSCommand: async (request: InvokePSCommandRequest): Promise<ResultDataSet> =>
    ipcRenderer.invoke("ps:invokePSCommand", request),
  getElectronEnvironment: async (): Promise<ElectronEnvironment> =>
    ipcRenderer.invoke("node:getElectronEnvironment"),
  changeWindowState: (state: WindowState) => ipcRenderer.send("win:changeWindowState", state),
  checkForUpdates: () => ipcRenderer.send("update:checkForUpdates"),

  onZoom: (callback: (zoom: number) => void) =>
    ipcRenderer.on("win:onZoom", (_event, zoom: number) => callback(zoom)),
  offZoom: () => ipcRenderer.removeAllListeners("win:onZoom"),
  onDownloadStatusUpdate: (callback: (status: UpdateDownloadStatus) => void) =>
    ipcRenderer.on("update:onDownloadStatusUpdate", (_event, status: UpdateDownloadStatus) =>
      callback(status),
    ),
  offDownloadStatusUpdate: () => ipcRenderer.removeAllListeners("update:onDownloadStatusUpdate"),
};

export type ElectronAPI = typeof api;

contextBridge.exposeInMainWorld("electronAPI", api);
