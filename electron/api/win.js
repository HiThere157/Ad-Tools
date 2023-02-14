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

module.exports = {
  changeWinState,
  handleZoom,
};
