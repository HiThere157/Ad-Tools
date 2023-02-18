const { autoUpdater } = require("electron-updater");

// configure electron-builder autoUpdater
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true";

const handleAppUpdater = async (window) => {
  const result = await autoUpdater.checkForUpdates();

  if (result?.downloadPromise) {
    window.webContents.send("update:appDownloadStatusUpdate", "pending");
    result?.downloadPromise
      ?.then(() => {
        window.webContents.send("update:appDownloadStatusUpdate", "complete");
      })
      ?.catch(() => {
        window.webContents.send("update:appDownloadStatusUpdate", "error");
      });
  }

  return { output: { version: result?.updateInfo?.version } };
};

module.exports = { handleAppUpdater };
