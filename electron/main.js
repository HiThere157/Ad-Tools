const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { executeCommand } = require("./api/powershell");

require("update-electron-app")();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
  win.removeMenu();
  win.webContents.openDevTools()
  win.loadFile("./build/index.html");
}

app.whenReady().then(() => {
  ipcMain.handle("ps:executeCommand", executeCommand);
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
