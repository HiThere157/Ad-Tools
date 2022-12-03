import { ElectronAPI, WinState } from "../../Types/api";

import WinButton from "./WinButton";

import { BsDashLg, BsSquare, BsXLg } from "react-icons/bs";

export default function WinControl() {
  const setWindowState = (state: WinState) => {
    try {
      (window as ElectronAPI).electronAPI.changeWinState(state);
    } catch { }
  }

  return (
    <div className="winbar-no-drag flex">
      <WinButton onClick={() => { setWindowState("minimize") }}>
        <BsDashLg />
      </WinButton>
      <WinButton onClick={() => { setWindowState("maximize_restore") }}>
        <BsSquare />
      </WinButton>
      <WinButton onClick={() => { setWindowState("quit") }}>
        <BsXLg />
      </WinButton>
    </div>
  );
}