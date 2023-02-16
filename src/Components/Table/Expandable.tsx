import { useState } from "react";

import Button from "../Button";

import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";

type ExpandableProps = {
  children: React.ReactNode;
  canExpand?: boolean;
};
export default function Expandable({ children, canExpand = true }: ExpandableProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {canExpand ? (
        <div className="flex gap-x-2">
          <div className="flex flex-col gap-y-1 items-center my-1">
            <Button classList="p-1" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <BsArrowsAngleContract /> : <BsArrowsAngleExpand />}
            </Button>

            {isOpen && (
              <Button classList="p-0 my-1 flex-grow" onClick={() => setIsOpen(!isOpen)}></Button>
            )}
          </div>
          {isOpen ? (
            children
          ) : (
            <div className="flex items-center">
              <span className="dark:text-whiteColorAccent">Expand to view full Object</span>
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </>
  );
}
