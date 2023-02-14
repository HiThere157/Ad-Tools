const { app, shell, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// override console.{log, error, ...} functions with the provided electron-log functions
const log = require("electron-log");
Object.assign(console, log.functions);

const {
  executeCommand,
  getExecutingUser,
  getDomainSuffixList,
  startComputerAction,
  authAzureAD,
} = require("./api/powershell");
const { probeConnection, getVersion, getModuleVersion } = require("./api/node");
const { changeWinState, handleZoom } = require("./api/win");
const { handleUpdater } = require("./api/update");

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#1A1A1A",
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "assets/icon32.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.removeMenu();
  window.loadFile("./build/index.html");

  // handle ctrl+scroll event to zoom
  window.webContents.on("zoom-changed", (_event, zoomDirection) => {
    handleZoom(window, zoomDirection);
  });
  // handle F12 for dev console and ctrl+{+,-} for zoom
  window.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      window.webContents.openDevTools();
      event.preventDefault();
    }

    if (input.type !== "keyDown" || !input.control) return;

    if (input.key === "+") {
      handleZoom(window, "in");
    }
    if (input.key === "-") {
      handleZoom(window, "out");
    }
  });

  // open lins with target="_blank" in real browser
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // handle all api call requests
  ipcMain.handle("ps:executeCommand", executeCommand);
  ipcMain.handle("ps:getExecutingUser", getExecutingUser);
  ipcMain.handle("ps:getDomainSuffixList", getDomainSuffixList);
  ipcMain.handle("ps:startComputerAction", startComputerAction);
  ipcMain.handle("ps:authAzureAD", authAzureAD);

  ipcMain.handle("node:probeConnection", probeConnection);
  ipcMain.handle("node:getVersion", getVersion);
  ipcMain.handle("node:getModuleVersion", getModuleVersion);

  ipcMain.on("win:changeWinState", (_event, state) => {
    changeWinState(window, state);
  });

  ipcMain.handle("update:checkForUpdate", async () => {
    return await handleUpdater(window);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
