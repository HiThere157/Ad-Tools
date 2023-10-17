import { BrowserWindow } from "electron";

export function changeWindowState(window: BrowserWindow, state: WindowState) {
  switch (state) {
    case "minimize":
      window.minimize();
      break;

    case "maximize_restore":
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
      break;

    case "close":
      window.close();
      break;
  }
}

export function changeZoom(window: BrowserWindow, direction: "in" | "out") {
  const currentZoom = window.webContents.getZoomFactor();

  const newZoom = direction === "in" ? currentZoom + 0.1 : currentZoom - 0.1;
  const clampedZoom = Math.min(Math.max(newZoom, 0.5), 1.5);

  window.webContents.setZoomFactor(clampedZoom);
  window.webContents.send("win:onZoom", clampedZoom);
}
