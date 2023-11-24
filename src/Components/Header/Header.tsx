import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../Redux/store";

import WindowControls from "./WindowControls";

export default function Header() {
  const { appChannel, executingUser } = useSelector((state: RootState) => state.environment);

  return (
    <header
      style={{ gridArea: "header" }}
      className="winbar-drag-region flex select-none items-center border-b-2 border-border bg-light"
    >
      <NavLink
        draggable="false"
        className="winbar-no-drag ms-2 flex items-center gap-3 rounded px-1 outline-none outline-offset-0 focus-visible:outline-secondaryActive"
        to="/"
      >
        <img
          draggable="false"
          src={appChannel === "stable" ? "./icon.svg" : "./icon_beta.svg"}
          alt="AD Tools Logo"
          className="h-6"
        />
        <span className="text-xl font-bold">
          <span>AD Tools</span>

          {appChannel === "beta" && <span className="ml-2">[BETA]</span>}
        </span>
      </NavLink>

      <span className="mx-2 text-grey ">{executingUser}</span>

      <div className="flex-1" />

      <WindowControls />
    </header>
  );
}
