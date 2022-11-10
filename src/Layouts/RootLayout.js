import React from "react";
import { useSessionStorage } from "../Helper/useLocalStorage";

import Button from "../Components/Button";
import NavBar from "../Components/NavBar";

import { BsListUl } from "react-icons/bs";

export default function RootLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useSessionStorage("main_isNavOpen", true);

  return (
    <main className="flex flex-col dark:text-foreground dark:bg-primaryBg">
      <Header
        onNavOpen={() => {
          setIsNavOpen(!isNavOpen);
        }}
      />
      <div className="flex flex-grow min-h-screen">
        <NavBar isOpen={isNavOpen} />
        <article className="p-4 w-full">{children}</article>
      </div>
    </main>
  );
}

function Header({ onNavOpen }) {
  return (
    <div className="flex space-x-5 top-0 w-full p-2 border-b-2 dark:bg-secondaryBg dark:border-secondaryBorderAccent">
      <Button classOverride="text-3xl mx-1 px-3 border-0" onClick={onNavOpen}>
        <BsListUl />
      </Button>
      <span className="font-bold text-3xl whitespace-nowrap">Ad Tools v2</span>
    </div>
  );
}
