const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeCommand: (command, args) => ipcRenderer.invoke("ps:executeCommand", command, args),
  getExecutingUser: () => ipcRenderer.invoke("ps:getExecutingUser"),
  probeConnection: (target) => ipcRenderer.invoke("node:probeConnection", target),
});
