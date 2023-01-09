import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import useIntersectionObserver from "../Hooks/useIntersectionObserver";

import WinButton from "./WinBar/WinButton";

import { BsHash, BsReverseLayoutTextWindowReverse } from "react-icons/bs";

export default function TableOfContents() {
  const { pathname } = useLocation();

  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [headings, setHeadings] = useState<HTMLHeadElement[]>([]);
  const [activeIndex, setActiveindex] = useState<number>(0);

  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (ref.current && !ref.current.contains(target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useIntersectionObserver(headings, setActiveindex);
  useEffect(() => {
    setHeadings([...document.querySelectorAll("h2")]);
  }, [pathname]);

  return (
    <div ref={ref} className="z-30">
      <WinButton onClick={() => setIsOpen(!isOpen)}>
        <BsReverseLayoutTextWindowReverse />
      </WinButton>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <TableOfContentsBody headings={headings} activeIndex={activeIndex} />
      </div>
    </div>
  );
}

type TableOfContentsBodyProps = {
  headings: HTMLHeadElement[];
  activeIndex: number;
};
function TableOfContentsBody({ headings, activeIndex }: TableOfContentsBodyProps) {
  return (
    <div className="container absolute right-0 w-max mt-1 p-2">
      <span className="block text-xl mb-1">Table of Contents</span>
      <div className="flex flex-col">
        {headings.map((heading, index) => {
          return (
            <div
              key={index}
              className={
                "flex items-center space-x-1 cursor-pointer py-0.5 " +
                (index === activeIndex ? "dark:text-whiteColor" : "dark:text-whiteColorAccent")
              }
            >
              <span>
                <BsHash className="scale-125" />
              </span>
              <span onClick={() => heading.scrollIntoView({behavior: "smooth"})}>{heading.innerText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
