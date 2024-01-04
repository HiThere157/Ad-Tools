import { electronWindow } from "../../Helper/api";

import HeaderButton from "./HeaderButton";

import { BsDashLg, BsSquare, BsXLg } from "react-icons/bs";

export default function WindowControls() {
  function setWindowState(state: WindowState) {
    electronWindow.electronAPI?.setWindowState(state);
  }

  return (
    <div className="winbar-no-drag">
      <HeaderButton onClick={() => setWindowState("minimize")}>
        <BsDashLg />
      </HeaderButton>
      <HeaderButton onClick={() => setWindowState("maximize_restore")}>
        <BsSquare />
      </HeaderButton>
      <HeaderButton onClick={() => setWindowState("close")}>
        <BsXLg />
      </HeaderButton>
    </div>
  );
}
