import { NavLink } from "react-router-dom";

import WindowControls from "./WindowControls";

export default function Header() {
  return (
    <header
      style={{ gridArea: "header" }}
      className="flex select-none items-center border-b-2 border-border bg-light"
    >
      <NavLink draggable="false" className="flex items-center" to="/">
        <img
          draggable="false"
          src="./icon.svg"
          alt="AD Tools Logo"
          className="mx-3 h-6"
        />
        <span className="text-xl font-bold">AD Tools</span>
      </NavLink>

      <span className="mx-3 text-grey ">ALCON\KOCHDA7</span>

      <div className="flex-1" />

      <WindowControls />
    </header>
  );
}
