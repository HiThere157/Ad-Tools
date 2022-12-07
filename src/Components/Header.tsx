import { useEffect, useState } from "react";

import { electronAPI } from "../Helper/makeAPICall";

import WinControl from "./WinBar/WinControl";
import TableOfContents from "./TableOfContents";

export default function Header() {
  const [user, setUser] = useState("/");

  useEffect(() => {
    (async () => {
      const result = await electronAPI?.getExecutingUser();
      setUser(result?.output ?? "/");
    })();
  }, []);

  return (
    <div
      style={{ gridArea: "header" }}
      className="winbar-drag-region select-none flex justify-between border-b-2 dark:bg-secondaryBg dark:border-primaryBorder"
    >
      <div className="flex items-center">
        <img
          src="./icon.svg"
          alt="AD Tools Logo"
          className="mx-[1.1rem] h-6"
        ></img>
        <div className="flex space-x-3 items-center whitespace-nowrap">
          <span className="font-bold text-xl">AD Tools</span>
          <span className="dark:text-foregroundAccent">{user}</span>
        </div>
      </div>

      <div className="winbar-no-drag flex space-x-2">
        <TableOfContents />
        <WinControl />
      </div>
    </div>
  );
}
