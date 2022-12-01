const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater")
const path = require("path");

const log = require("electron-log");
Object.assign(console, log.functions);

autoUpdater.checkForUpdatesAndNotify();

const {
  executeCommand,
  getExecutingUser,
  startComputerAction,
} = require("./api/powershell");
const { probeConnection } = require("./api/node");

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
    handleZoom(win, zoomDirection);
  });

  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      win.webContents.openDevTools();
      event.preventDefault();
    }

    if (input.type === "keyDown" && input.key === "+" && input.control) {
      handleZoom(win, "in");
    }
    if (input.type === "keyDown" && input.key === "-" && input.control) {
      handleZoom(win, "out");
    }
  });

  win.removeMenu();
  win.loadFile("./build/index.html");
}

function handleZoom(window, direction) {
  const currentZoom = window.webContents.getZoomFactor();
  let nextZoom = 1;

  if (direction === "in") {
    nextZoom = currentZoom + 0.1;
  }
  if (direction === "out") {
    nextZoom = currentZoom - 0.1;
  }

  const clamped = Math.min(1.5, Math.max(0.5, nextZoom));

  window.webContents.send("win:setZoom", clamped);
  window.webContents.zoomFactor = clamped;
}

app.whenReady().then(() => {
  ipcMain.handle("ps:executeCommand", executeCommand);
  ipcMain.handle("ps:getExecutingUser", getExecutingUser);
  ipcMain.handle("ps:startComputerAction", startComputerAction);
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
