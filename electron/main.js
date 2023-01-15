const { app, shell, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

// override console.{log, error, ...} functions with the provided electron-log functions
const log = require("electron-log");
Object.assign(console, log.functions);


// configure electron-builder autoUpdater
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = process.env.AD_TOOLS_PRERELEASE.toLowerCase() === "true";
autoUpdater.checkForUpdatesAndNotify();

const {
  executeCommand,
  getExecutingUser,
  getDomainSuffixList,
  startComputerAction,
  authAzureAD,
} = require("./api/powershell");
const { probeConnection, getVersion } = require("./api/node");

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

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#1A1A1A",
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "assets/icon32.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.removeMenu();
  win.loadFile("./build/index.html");

  // handle ctrl+scroll event to zoom
  win.webContents.on("zoom-changed", (_event, zoomDirection) => {
    handleZoom(win, zoomDirection);
  });
  // handle F12 for dev console and ctrl+{+,-} for zoom
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

  // open lins with target="_blank" in real browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // listen for window state change requests from renderer
  ipcMain.on("win:changeWinState", (_event, state) => {
    switch (state) {
      case "minimize":
        win.minimize();
        break;

      case "maximize_restore":
        win.isMaximized() ? win.restore() : win.maximize();
        break;

      case "quit":
        win.close();
        break;
    }
  });
}

app.whenReady().then(() => {
  // handle all api call requests
  ipcMain.handle("ps:executeCommand", executeCommand);
  ipcMain.handle("ps:getExecutingUser", getExecutingUser);
  ipcMain.handle("ps:getDomainSuffixList", getDomainSuffixList);
  ipcMain.handle("ps:startComputerAction", startComputerAction);
  ipcMain.handle("ps:authAzureAD", authAzureAD);
  ipcMain.handle("node:probeConnection", probeConnection);
  ipcMain.handle("node:getVersion", getVersion);

  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
