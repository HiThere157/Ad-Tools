const { autoUpdater } = require("electron-updater");

// configure electron-builder autoUpdater
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true";

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

  return { output: { version: result?.updateInfo?.version } };
};

module.exports = {
  handleUpdater,
};
