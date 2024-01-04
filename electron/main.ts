import { app, shell, BrowserWindow, ipcMain } from "electron";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";
import path = require("path");

import { invokePSCommand } from "./api/powershell";
import { getElectronEnvironment } from "./api/node";
import { setWindowState } from "./api/win";
import { checkForUpdates } from "./api/update";

app.on("ready", () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 680,
    minHeight: 510,
    backgroundColor: "#1A1A1A",
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "assets/icon32.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.removeMenu();
  window.loadFile(path.join(__dirname, "web/index.html"));

  // Handle F12 for dev console and install Redux DevTools
  window.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      window.webContents.openDevTools();
      event.preventDefault();
    }
  });
  if (getElectronEnvironment().appChannel === "beta") {
    installExtension(REDUX_DEVTOOLS, {
      loadExtensionOptions: { allowFileAccess: true },
    });
  }

  // Open links with target="_blank" in real browser
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Handle API requests
  ipcMain.handle("ps:invokePSCommand", invokePSCommand);
  ipcMain.handle("node:getElectronEnvironment", getElectronEnvironment);

  // Handle window state and zoom changes
  ipcMain.on("win:setWindowState", (_event, state: WindowState) => {
    setWindowState(window, state);
  });
  ipcMain.on("win:setZoom", (_event, zoom: number) => {
    window.webContents.setZoomFactor(zoom);
  });

  // Handle Updater
  ipcMain.on("update:checkForUpdates", async () => {
    checkForUpdates(window);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
