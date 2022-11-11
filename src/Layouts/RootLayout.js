import React from "react";
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
        <article className="flex-grow p-4 min-w-0 overflow-auto">
          {children}
        </article>
      </div>
    </main>
  );
}

function Header({ onNavOpen }) {
  return (
    <div className="flex space-x-3 top-0 w-full p-1 border-b-2 dark:bg-secondaryBg dark:border-secondaryBorderAccent">
      <Button classOverride="text-xl mx-1 px-3 border-0" onClick={onNavOpen}>
        <BsListUl />
      </Button>
      <span className="font-bold text-2xl whitespace-nowrap">Ad Tools</span>
    </div>
  );
}
