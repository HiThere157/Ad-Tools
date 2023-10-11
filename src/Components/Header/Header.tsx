import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { defaultEnvironment } from "../../Config/default";
import { getEnvironment } from "../../Helper/api";

import WindowControls from "./WindowControls";

export default function Header() {
  const [env, setEnv] = useState<ElectronEnvironment>(defaultEnvironment);

  useEffect(() => {
    getEnvironment().then(setEnv);
  }, []);

  return (
    <header
      style={{ gridArea: "header" }}
      className="winbar-drag-region flex select-none items-center border-b-2 border-border bg-light"
    >
      <NavLink draggable="false" className="winbar-no-drag flex items-center" to="/">
        <img
          draggable="false"
          src={env.appChannel === "stable" ? "./icon.svg" : "./icon_beta.svg"}
          alt="AD Tools Logo"
          className="mx-3 h-6"
        />
        <span className="text-xl font-bold">
          <span>AD Tools</span>

          {env.appChannel === "beta" && <span className="ml-2">[BETA]</span>}
        </span>
      </NavLink>

      <span className="mx-3 text-grey ">{env.executingUser}</span>

      <div className="flex-1" />

      <WindowControls />
    </header>
  );
}
