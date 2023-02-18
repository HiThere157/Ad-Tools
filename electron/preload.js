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
  getAddInVersion: () => ipcRenderer.invoke("node:getAddInVersion"),

  changeWinState: (state) => ipcRenderer.send("win:changeWinState", state),
  handleZoomUpdate: (callback) => ipcRenderer.on("win:setZoom", (_event, value) => callback(value)),
  removeZoomListener: () => {
    if (Object.values(CONTENT_EVENTS.E2C).includes("win:setZoom")) {
      ipcRenderer.removeAllListeners("win:setZoom");
    }
  },

  checkForAppUpdate: () => ipcRenderer.invoke("update:checkForAppUpdate"),
  handleAppDownloadStatusUpdate: (callback) =>
    ipcRenderer.on("update:appDownloadStatusUpdate", (_event, status) => callback(status)),
  removeAppDownloadStatusUpdate: () => {
    if (Object.values(CONTENT_EVENTS.E2C).includes("update:appDownloadStatusUpdate")) {
      ipcRenderer.removeAllListeners("update:appDownloadStatusUpdate");
    }
  },

  checkForExcelAdUpdate: () => ipcRenderer.invoke("update:checkForExcelAdUpdate"),
  handleExcelAdDownloadStatusUpdate: (callback) =>
    ipcRenderer.on("update:excelAdDownloadStatusUpdate", (_event, status) => callback(status)),
  removeExcelAdDownloadStatusUpdate: () => {
    if (Object.values(CONTENT_EVENTS.E2C).includes("update:excelAdDownloadStatusUpdate")) {
      ipcRenderer.removeAllListeners("update:excelAdDownloadStatusUpdate");
    }
  },
});
