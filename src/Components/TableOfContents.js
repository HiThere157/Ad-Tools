import { useEffect, useState } from "react";

import useIntersectionObserver from "../Helper/useIntersectionObserver";

import { BsFillCaretRightFill, BsFillCaretDownFill } from "react-icons/bs";

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeIndex, setActiveindex] = useState(0);

  useIntersectionObserver(setActiveindex);
  useEffect(() => {
    setHeadings([...document.querySelectorAll("h2")]);
  }, []);

  return (
    <div className="container fixed right-10 top-15 p-2">
      <span className="block text-xl mb-1">Table of Contents</span>
      <div className="flex flex-col">
        {headings.map((heading, index) => {
          return (
            <div
              className={
                "flex items-center space-x-1 cursor-pointer py-0.5 " +
                (index === activeIndex
                  ? "dark:text-foreground"
                  : "dark:text-foregroundAccent")
              }
            >
              <span>
                {index === activeIndex ? (
                  <BsFillCaretDownFill />
                ) : (
                  <BsFillCaretRightFill />
                )}
              </span>
              <span
                key={index}
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
  );
}
