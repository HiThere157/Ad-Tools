import { useEffect, useState, useRef } from "react";

import { electronAPI } from "../Helper/makeAPICall";
import WinButton from "./WinBar/WinButton";

import { BsDownload } from "react-icons/bs";

export default function UpdateManager() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  (async () => {
    console.log(electronAPI?.checkForUpdate());
  })();

  return (
    <div ref={ref} className="z-[20]">
      <WinButton onClick={() => setIsOpen(!isOpen)}>
        <BsDownload />
      </WinButton>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <UpdateManagerBody />
      </div>
    </div>
  );
}

function UpdateManagerBody() {
  return (
    <div className="container absolute right-0 w-max mt-1 p-2">
      <span className="block text-xl mb-1">Update Manager</span>
    </div>
  );
}
