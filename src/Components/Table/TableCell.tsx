import { useState } from "react";

import Button from "../Button";

import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";

type TableCellProps = {
  content: string;
};
export default function TableCell({ content }: TableCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMultiLine = content.includes("\n");

  if (!isMultiLine) return content;

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
