const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeCommand: (request) => ipcRenderer.invoke("ps:executeCommand", request),
  getExecutingUser: () => ipcRenderer.invoke("ps:getExecutingUser"),
  getDomainSuffixList: () => ipcRenderer.invoke("ps:getDomainSuffixList"),
  startComputerAction: (options) => ipcRenderer.invoke("ps:startComputerAction", options),
  authAzureAD: (options) => ipcRenderer.invoke("ps:authAzureAD", options),

  probeConnection: (target) => ipcRenderer.invoke("node:probeConnection", target),
  getAppVersion: () => ipcRenderer.invoke("node:getAppVersion"),
  getModuleVersion: () => ipcRenderer.invoke("node:getModuleVersion"),

  changeWinState: (state) => ipcRenderer.send("win:changeWinState", state),
  handleZoomUpdate: (callback) => ipcRenderer.on("win:setZoom", (_event, value) => callback(value)),
  removeZoomListener: () => {
    ipcRenderer.removeAllListeners("win:setZoom");
  },

  checkForAppUpdate: () => ipcRenderer.invoke("update:checkForAppUpdate"),
  handleAppDownloadStatusUpdate: (callback) =>
    ipcRenderer.on("update:appDownloadStatusUpdate", (_event, status) => callback(status)),
  removeAppDownloadStatusUpdate: () => {
    ipcRenderer.removeAllListeners("update:appDownloadStatusUpdate");
  },
});
