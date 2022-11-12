import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../Helper/useStorage";

import Button from "../Components/Button";
import NavBar from "../Components/NavBar";

import { BsListUl } from "react-icons/bs";

export default function RootLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useLocalStorage("main_isNavOpen", true);

  return (
    <main className="flex flex-col dark:text-foreground dark:bg-primaryBg h-screen">
      <Header
        onNavOpen={() => {
          setIsNavOpen(!isNavOpen);
        }}
      />
      <div className="flex flex-grow min-h-0">
        <NavBar isOpen={isNavOpen} />
        <div className="flex-grow p-4 min-w-0 overflow-auto">{children}</div>
      </div>
    </main>
  );
}

function Header({ onNavOpen }) {
  const [user, setUser] = useState("/");

  useEffect(() => {
    (async () => {
      try {
        const { output } = await window.electronAPI.getExecutingUser();
        setUser(output);
      } catch {
        setUser("/");
      }
    })();
  }, []);

  return (
    <div className="flex top-0 w-full p-1 border-b-2 dark:bg-secondaryBg dark:border-secondaryBorderAccent">
      <Button classOverride="text-xl mx-1 px-3 border-0" onClick={onNavOpen}>
        <BsListUl />
      </Button>
      <div className="flex space-x-3 items-center ml-3">
        <span className="font-bold text-2xl whitespace-nowrap">Ad Tools</span>
        <span className="dark:text-foregroundAccent">{user}</span>
      </div>
    </div>
  );
}
