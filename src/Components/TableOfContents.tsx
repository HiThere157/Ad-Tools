import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import useIntersectionObserver from "../Hooks/useIntersectionObserver";

import Button from "./Button";

import { BsHash, BsReverseLayoutTextWindowReverse } from "react-icons/bs";

export default function TableOfContents() {
  const { pathname } = useLocation();

  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<HTMLHeadElement[]>([]);
  const [activeIndex, setActiveindex] = useState(0);

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
    <div ref={ref} className="z-10">
      <Button classOverride="text-xl h-full mx-1 px-3 border-0" onClick={() => { setIsOpen(!isOpen) }}>
        <BsReverseLayoutTextWindowReverse />
      </Button>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <TableOfContentsBody headings={headings} activeIndex={activeIndex} />
      </div>
    </div>
  );
}

type TableOfContentsBodyProps = {
  headings: HTMLHeadElement[]
  activeIndex: number
}
function TableOfContentsBody({ headings, activeIndex }: TableOfContentsBodyProps) {
  return (
    <div className="container absolute right-2 w-max mt-2 p-2">
      <span className="block text-xl mb-1">Table of Contents</span>
      <div className="flex flex-col">
        {headings.map((heading, index) => {
          return (
            <div
              key={index}
              className={
                "flex items-center space-x-1 cursor-pointer py-0.5 " +
                (index === activeIndex
                  ? "dark:text-foreground"
                  : "dark:text-foregroundAccent")
              }
            >
              <span><BsHash className="scale-125"/></span>
              <span
                onClick={() => {
                  heading.scrollIntoView();
                }}
              >
                {heading.innerText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}