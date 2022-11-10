const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeCommand: (command, args) => ipcRenderer.invoke("ps:executeCommand", command, args),
});
