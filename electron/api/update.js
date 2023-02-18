const { autoUpdater } = require("electron-updater");
const axios = require("axios");

const { getAddInVersion } = require("./node");

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

const handleExcelAdUpdater = async (window) => {
  const result = await axios("https://api.github.com/repos/HiThere157/ExcelAD/releases");
  const releases = result.data;

  const nextReleaseVersion = releases.filter(
    (release) => process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true" || !release.prerelease,
  )?.[0]?.name;

  const installedVersion = getAddInVersion().output.excelAD;

  if (nextReleaseVersion !== installedVersion && nextReleaseVersion) {
    window.webContents.send("update:excelAdDownloadStatusUpdate", "pending");

    //start download
    // | "error" | "upToDate";
  }

  return { output: { version: nextReleaseVersion } };
};

module.exports = {
  handleAppUpdater,
  handleExcelAdUpdater,
};
