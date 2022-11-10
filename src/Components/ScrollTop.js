import { useState, useEffect } from "react";

import Button from "./Button";

import { BsArrowUpCircleFill } from "react-icons/bs";

export default function ScrollTop() {
  const [scrolled, setScrolled] = useState();

  const scrollTop = () => {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 1000) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {scrolled ? (
        <Button
          classOverride="fixed bottom-0 right-0 p-2 px-3 m-3"
          highlight={true}
          onClick={scrollTop}
        >
          <div className="flex items-center space-x-3 text-2xl">
            <BsArrowUpCircleFill />
            <span>Scroll to Top</span>
          </div>
        </Button>
      ) : (
        ""
      )}
    </>
  );
}
