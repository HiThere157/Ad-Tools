import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../Redux/store";

import WindowControls from "./WindowControls";

export default function Header() {
  const { appChannel, executingUser, executingAzureUser } = useSelector(
    (state: RootState) => state.environment,
  );

  return (
    <header
      style={{ gridArea: "header" }}
      className="winbar-drag-region flex select-none items-center border-b-2 border-border bg-light"
    >
      <NavLink
        draggable="false"
        className="winbar-no-drag flex items-center rounded px-1 outline-none outline-offset-0 focus-visible:outline-secondaryActive"
        to="/"
      >
        <img
          draggable="false"
          src={appChannel === "stable" ? "./icon.svg" : "./icon_beta.svg"}
          alt="AD Tools Logo"
          className="mx-2 h-6"
        />
        <span className="mx-1 text-xl font-bold">
          <span>AD Tools</span>
          {appChannel === "beta" && <span className="ml-1">[BETA]</span>}
        </span>
      </NavLink>

      <span className="mx-1.5 text-grey">
        <span>{executingUser}</span>
        {executingAzureUser && <span className="ml-1">({executingAzureUser})</span>}
      </span>

      <div className="flex-1" />

      <WindowControls />
    </header>
  );
}
