import { app, shell, BrowserWindow, ipcMain } from "electron";
import path = require("path");

import { invokePSCommand } from "./api/powershell";
import { changeWindowState } from "./api/win";

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
  window.loadFile(path.join(__dirname, "web/index.html"));

  // Handle F12 for dev console
  window.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      window.webContents.openDevTools();
      event.preventDefault();
    }
  });

  // Open links with target="_blank" in real browser
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Handle API requests
  ipcMain.handle("ps:invokePSCommand", invokePSCommand);

  // Handle window state changes
  ipcMain.on("win:changeWindowState", (_event, state: WindowState) => {
    changeWindowState(window, state);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
