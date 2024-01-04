import { BrowserWindow } from "electron";

export function setWindowState(window: BrowserWindow, state: WindowState) {
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
