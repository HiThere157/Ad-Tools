import { useState } from "react";

import Button from "../Button";

import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";

type TableCellProps = {
  content: string;
  canRedirect: boolean;
  onRedirect: (newTab: boolean) => void;
};
export default function TableCell({ content, canRedirect, onRedirect }: TableCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMultiLine = content.includes("\n");

  if (!isMultiLine)
    return (
      <span
        className={
          canRedirect ? "cursor-pointer text-primaryAccent underline hover:text-primaryActive" : ""
        }
        onClick={(event) => canRedirect && onRedirect(event.ctrlKey || event.metaKey)}
        onMouseUp={(e) => {
          if (!canRedirect) return;

          if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            onRedirect(true);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {content}
      </span>
    );

  return (
    <>
      {isExpanded ? (
        <div className="flex gap-2">
          <div className="my-0.5 flex flex-col items-center gap-1">
            <Button className="h-6 px-0.5" onClick={() => setIsExpanded(false)}>
              <BsArrowsAngleContract />
            </Button>

            <Button className="h-full px-0.5" onClick={() => setIsExpanded(false)}></Button>
          </div>

          <span>{content}</span>
        </div>
      ) : (
        <div className="my-0.5 flex items-center gap-2">
          <Button className="h-6 px-0.5" onClick={() => setIsExpanded(true)}>
            <BsArrowsAngleExpand />
          </Button>
          <span className="text-grey">Expand full object</span>
        </div>
      )}
    </>
  );
}
