const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeCommand: (command, args) =>
    ipcRenderer.invoke("ps:executeCommand", command, args),

  getExecutingUser: () => ipcRenderer.invoke("ps:getExecutingUser"),

  probeConnection: (target) =>
    ipcRenderer.invoke("node:probeConnection", target),

  handleZoomUpdate: (callback) =>
    ipcRenderer.on("win:setZoom", (_event, ...args) => callback(args)),
  removeZoomListener: () => {
    if (Object.values(CONTENT_EVENTS.E2C).includes("win:setZoom")) {
      ipcRenderer.removeAllListeners("win:setZoom");
    }
  },
});
