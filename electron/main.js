const { app, shell, BrowserWindow } = require("electron");
const path = require("path");

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#1A1A1A",
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "assets/icon32.png"),
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
});

app.on("window-all-closed", () => {
  app.quit();
});
