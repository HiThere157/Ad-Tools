import { useEffect, useState } from "react"

import { ElectronAPI } from "../Helper/makeAPICall";

import Button from "../Components/Button";
import TableOfContents from "../Components/TableOfContents";

import { BsListUl } from "react-icons/bs";

type HeaderProps = {
  onNavOpen: Function
}
export default function Header({ onNavOpen }: HeaderProps) {
  const [user, setUser] = useState("/");

  useEffect(() => {
    (async () => {
      try {
        const { output } = await (window as ElectronAPI).electronAPI.getExecutingUser();
        setUser(output);
      } catch {
        setUser("/");
      }
    })();
  }, []);

  return (
    <div className="flex top-0 justify-between w-full p-1 border-b-2 dark:bg-secondaryBg dark:border-secondaryBorderAccent">
      <div className="flex">
        <Button classOverride="text-xl mx-1 px-3 border-0" onClick={onNavOpen}>
          <BsListUl />
        </Button>
        <div className="flex space-x-3 items-center ml-3">
          <span className="font-bold text-2xl whitespace-nowrap">Ad Tools</span>
          <span className="dark:text-foregroundAccent">{user}</span>
        </div>
      </div>

      <TableOfContents />
    </div>
  );
}