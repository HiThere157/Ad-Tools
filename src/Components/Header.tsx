import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { electronAPI } from "../Helper/makeAPICall";

import WinControl from "./WinBar/WinControl";
import TableOfContents from "./TableOfContents";

export default function Header() {
  const [user, setUser] = useState<string>("/");

  useEffect(() => {
    (async () => {
      const result = await electronAPI?.getExecutingUser();
      setUser(result?.output ?? "");
    })();
  }, []);

  return (
    <div
      style={{ gridArea: "header" }}
      className="winbar-drag-region select-none flex justify-between border-b-2 dark:bg-lightBg dark:border-elFlatBorder"
    >
      <div className="flex items-center">
        <NavLink to="/" className="winbar-no-drag">
          <img src="./icon.svg" alt="AD Tools Logo" className="mx-[1.1rem] h-6"></img>
        </NavLink>
        <div className="flex space-x-3 items-center mt-0.5 whitespace-nowrap">
          <NavLink to="/" className="winbar-no-drag">
            <span className="font-bold text-xl">AD Tools</span>
          </NavLink>
          <span className="dark:text-whiteColorAccent">{user}</span>
        </div>
      </div>

      <div className="winbar-no-drag flex space-x-2">
        <TableOfContents />
        <WinControl />
      </div>
    </div>
  );
}
