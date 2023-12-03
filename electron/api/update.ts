import { BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";

autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true";

export async function checkForUpdates(window: BrowserWindow): Promise<string> {
  const update = await autoUpdater.checkForUpdates();

  if (update?.downloadPromise) {
    window.webContents.send("update:onDownloadStatusUpdate", "pending");

    update.downloadPromise
      .then(() => window.webContents.send("update:onDownloadStatusUpdate", "complete"))
      .catch(() => window.webContents.send("update:onDownloadStatusUpdate", "error"));
  }

  return update?.updateInfo?.version ?? "";
}
