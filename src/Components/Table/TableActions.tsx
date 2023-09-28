import { useState } from "react";

import { friendly } from "../../Config/lookup";

import Button from "../Button";
import Dropdown from "../Dropdown";

import {
  BsFunnel,
  BsLayoutThreeColumns,
  BsArrowCounterclockwise,
  BsClipboard,
} from "react-icons/bs";

type TableActionsProps = {
  onReset: () => void;
  onFilterMenu: () => void;
  onCopy: (onlySelection: boolean) => void;
  filters: TableFilter[];
  columns: string[];
  hiddenColumns: string[];
  setHiddenColumns: (hiddenColumns: string[]) => void;
};
export default function TableActions({
  onReset,
  onFilterMenu,
  onCopy,
  filters,
  columns,
  hiddenColumns,
  setHiddenColumns,
}: TableActionsProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const invertHiddenColumns = (hiddenColumns: string[]) => {
    return columns.filter((column) => !hiddenColumns.includes(column));
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        className={"p-1 " + (filters.length !== 0 ? "!border-primaryAccent" : "")}
        onClick={onFilterMenu}
      >
        <BsFunnel />
      </Button>
      <Dropdown
        items={columns}
        value={invertHiddenColumns(hiddenColumns)}
        onChangeMulti={(hiddenColumns) => {
          if (hiddenColumns.length === 0) return;
          setHiddenColumns(invertHiddenColumns(hiddenColumns));
        }}
        replacer={friendly}
        className={"p-1 " + (hiddenColumns.length !== 0 ? "!border-primaryAccent" : "")}
        disabled={columns.length === 0}
      >
        <BsLayoutThreeColumns />
      </Dropdown>
      <Dropdown
        items={["Copy All", "Copy Selection"]}
        value={""}
        onChange={(scope) => {
          onCopy(scope === "Copy Selection");
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 2000);
        }}
        className={"p-1 " + (hasCopied ? "!border-primaryAccent" : "")}
        disabled={columns.length === 0}
      >
        <BsClipboard />
      </Dropdown>
      <Button className="p-1" onClick={onReset}>
        <BsArrowCounterclockwise />
      </Button>
    </div>
  );
}
