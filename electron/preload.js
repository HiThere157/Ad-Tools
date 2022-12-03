const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeCommand: (request) => ipcRenderer.invoke("ps:executeCommand", request),

  getExecutingUser: () => ipcRenderer.invoke("ps:getExecutingUser"),

  startComputerAction: (action, target, useCurrentUser) =>
    ipcRenderer.invoke(
      "ps:startComputerAction",
      action,
      target,
      useCurrentUser
    ),

  probeConnection: (target) =>
    ipcRenderer.invoke("node:probeConnection", target),
  getVersion: () => ipcRenderer.invoke("node:getVersion"),

  handleZoomUpdate: (callback) =>
    ipcRenderer.on("win:setZoom", (_event, ...args) => callback(args)),
  removeZoomListener: () => {
    if (Object.values(CONTENT_EVENTS.E2C).includes("win:setZoom")) {
      ipcRenderer.removeAllListeners("win:setZoom");
    }
  },
});
