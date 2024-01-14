import { useState } from "react";

import Button from "../Button";
import Dropdown from "../Dropdown/Dropdown";

import { BsFunnel, BsPaintBucket, BsLayoutThreeColumns, BsClipboard } from "react-icons/bs";

type TableActionsProps = {
  isFilterOpen: boolean;
  isHighlightOpen: boolean;
  isColumnsOpen: boolean;
  setFilterOpen: (isFilterOpen: boolean) => void;
  setHighlightOpen: (isHighlightOpen: boolean) => void;
  setColumnsOpen: (isColumnsOpen: boolean) => void;
  onCopy: (onlySelection: boolean) => void;
  filters: TableFilter[];
  highlights: TableHighlight[];
};
export default function TableActions({
  isFilterOpen,
  isHighlightOpen,
  isColumnsOpen,
  setFilterOpen,
  setHighlightOpen,
  setColumnsOpen,
  onCopy,
  filters,
  highlights,
}: TableActionsProps) {
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <Button
        className={
          "p-1 " +
          (filters.some((filter) => filter.value.length !== 0) ? "!border-primaryAccent " : " ") +
          (isFilterOpen ? "text-primaryAccent" : "")
        }
        onClick={() => setFilterOpen(!isFilterOpen)}
      >
        <BsFunnel />
      </Button>
      <Button
        className={
          "p-1 " +
          (highlights.some((highlight) => highlight.strings.length !== 0)
            ? "!border-primaryAccent "
            : " ") +
          (isHighlightOpen ? "text-primaryAccent" : "")
        }
        onClick={() => setHighlightOpen(!isHighlightOpen)}
      >
        <BsPaintBucket />
      </Button>
      <Button
        className={"p-1 " + (isColumnsOpen ? "text-primaryAccent" : "")}
        onClick={() => setColumnsOpen(!isColumnsOpen)}
      >
        <BsLayoutThreeColumns />
      </Button>
      <Dropdown
        items={["Copy All", "Copy Selection"]}
        value={""}
        onChange={(scope) => {
          onCopy(scope === "Copy Selection");
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 2000);
        }}
        className={"p-1 " + (hasCopied ? "!border-primaryAccent" : "")}
      >
        <BsClipboard />
      </Dropdown>
    </div>
  );
}
