import { app, shell, BrowserWindow, ipcMain } from "electron";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";
import path = require("path");

import { invokePSCommand } from "./api/powershell";
import { getDnsSuffixList, getEnvironment } from "./api/node";
import { changeWindowState } from "./api/win";

app.on("ready", () => {
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
  window.loadFile(path.join(__dirname, "web/index.html"));

  // Handle F12 for dev console and install Redux DevTools
  window.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      window.webContents.openDevTools();
      event.preventDefault();
    }
  });
  if (getEnvironment().appChannel === "beta") {
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
  ipcMain.handle("node:getEnvironment", getEnvironment);
  ipcMain.handle("node:getDnsSuffixList", getDnsSuffixList);

  // Handle window state changes
  ipcMain.on("win:changeWindowState", (_event, state: WindowState) => {
    changeWindowState(window, state);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
