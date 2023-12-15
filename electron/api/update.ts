import { BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";

autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true";

export async function checkForUpdates(window: BrowserWindow) {
  const update = await autoUpdater.checkForUpdates();
  const version = update?.updateInfo?.version ?? "";

  function sendUpdate(version: string, status: string) {
    window.webContents.send("update:onDownloadStatusUpdate", {
      version,
      status,
    } as UpdateDownloadStatus);
  }

  if (update?.downloadPromise) {
    sendUpdate(version, "pending");

    update.downloadPromise
      .then(() => sendUpdate(version, "complete"))
      .catch(() => sendUpdate(version, "error"));
  }
}
