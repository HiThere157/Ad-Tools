import { electronWindow } from "../../Helper/api";

import HeaderButton from "./HeaderButton";

import { BsDashLg, BsSquare, BsXLg } from "react-icons/bs";

export default function WindowControls() {
  function changeWindowState(state: WindowState) {
    electronWindow.electronAPI?.changeWindowState(state);
  }

  return (
    <div className="winbar-no-drag">
      <HeaderButton onClick={() => changeWindowState("minimize")}>
        <BsDashLg />
      </HeaderButton>
      <HeaderButton onClick={() => changeWindowState("maximize_restore")}>
        <BsSquare />
      </HeaderButton>
      <HeaderButton onClick={() => changeWindowState("close")}>
        <BsXLg />
      </HeaderButton>
    </div>
  );
}
