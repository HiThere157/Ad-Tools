import { useState } from "react";

import Button from "../Components/Button";

import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";

export default function Expandable({ children, canExpand = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {canExpand ? (
        <div className="flex space-x-3">
          <div className="flex flex-col space-y-1 items-center my-1">
            <Button classOverride="p-1" onClick={toggleOpen}>
              {isOpen ? <BsArrowsAngleContract /> : <BsArrowsAngleExpand />}
            </Button>

            {isOpen ? (
              <Button
                classOverride="p-0 my-1 flex-grow"
                onClick={toggleOpen}
              ></Button>
            ) : (
              ""
            )}
          </div>
          {isOpen ? (
            children
          ) : (
            <div className="flex items-center">
              <span className="dark:text-foregroundAccent">Expand to view full Object</span>
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </>
  );
}
