const { autoUpdater } = require("electron-updater");

// configure electron-builder autoUpdater
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true";

const changeWinState = (window, state) => {
  switch (state) {
    case "minimize":
      window.minimize();
      break;

    case "maximize_restore":
      window.isMaximized() ? window.restore() : window.maximize();
      break;

    case "quit":
      window.close();
      break;
  }
};

const handleZoom = (window, direction) => {
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
};

const handleUpdater = async (window) => {
  const result = await autoUpdater.checkForUpdates();

  if (result?.downloadPromise) {
    window.webContents.send("update:downloadStatusUpdate", "pending");
    result?.downloadPromise
      ?.then(() => {
        window.webContents.send("update:downloadStatusUpdate", "complete");
      })
      ?.catch(() => {
        window.webContents.send("update:downloadStatusUpdate", "error");
      });
  }

  return {
    version: result?.updateInfo?.version,
  };
};

module.exports = {
  changeWinState,
  handleZoom,
  handleUpdater,
};
