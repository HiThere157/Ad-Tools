const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { executeCommand, getExecutingUser } = require("./api/powershell");
const { probeConnection } = require("./api/node");

if (require("electron-squirrel-startup")) app.quit();
require("update-electron-app")();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "assets/icon32.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.on("zoom-changed", (_event, zoomDirection) => {
    const currentZoom = win.webContents.getZoomFactor();
    let nextZoom = 1;

    if (zoomDirection === "in") {
      nextZoom = currentZoom + 0.1;
    }
    if (zoomDirection === "out") {
      nextZoom = currentZoom - 0.1;
    }

    win.webContents.send("win:setZoom", nextZoom);
    win.webContents.zoomFactor = Math.min(1.5, Math.max(0.5, nextZoom));
  });

  win.removeMenu();
  win.webContents.openDevTools();
  win.loadFile("./build/index.html");
}

app.whenReady().then(() => {
  ipcMain.handle("ps:executeCommand", executeCommand);
  ipcMain.handle("ps:getExecutingUser", getExecutingUser);
  ipcMain.handle("node:probeConnection", probeConnection);
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
