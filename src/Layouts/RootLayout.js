import React from "react";
import { useLocalStorage } from "../Helper/useStorage";

import Button from "../Components/Button";
import NavBar from "../Components/NavBar";
import ScrollTop from "../Components/ScrollTop";

import { BsListUl } from "react-icons/bs";

export default function RootLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useLocalStorage("main_isNavOpen", true);

  return (
    <main className="flex flex-col dark:text-foreground dark:bg-primaryBg min-h-screen">
      <Header
        onNavOpen={() => {
          setIsNavOpen(!isNavOpen);
        }}
      />
      <div className="flex flex-grow">
        <NavBar isOpen={isNavOpen} />
        <article className="p-4 w-full">{children}</article>
      </div>
      <ScrollTop />
    </main>
  );
}

function Header({ onNavOpen }) {
  return (
    <div className="flex space-x-4 top-0 w-full p-2 border-b-2 dark:bg-secondaryBg dark:border-secondaryBorderAccent">
      <Button classOverride="text-2xl mx-1 px-3 border-0" onClick={onNavOpen}>
        <BsListUl />
      </Button>
      <span className="font-bold text-3xl whitespace-nowrap">Ad Tools</span>
    </div>
  );
}
