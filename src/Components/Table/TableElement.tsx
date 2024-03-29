import { useEffect } from "react";

import { columnNames } from "../../Config/default";
import { ResultArray } from "../../Helper/array";
import stringify from "../../Helper/stringify";

import Button from "../Button";
import Checkbox from "../Checkbox";
import TableCell from "./TableCell";
import RedirectButton from "./RedirectButton";

import { BsCaretDownFill } from "react-icons/bs";

type TableElementProps = {
  entries?: PSResult[];
  columns: string[];
  sortDesc: boolean;
  sortedColumn: string;
  filter: Filter;
  onFilter: (n: number) => any;
  colorSettings: ColorSettings;
  selected: number[];
  onSelectedChange: (newSelected: number[]) => any;
  onHeaderClick: (header: string) => any;
  onRedirect?: (entry: PSResult) => any;
};
export default function TableElement({
  entries = [],
  columns,
  sortDesc,
  sortedColumn,
  filter,
  onFilter,
  colorSettings,
  selected,
  onSelectedChange,
  onHeaderClick,
  onRedirect,
}: TableElementProps) {
  useEffect(() => {
    onFilter(entries.length - getFinalEntries().length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, entries, selected]);

  const getFinalEntries = () => {
    return new ResultArray(entries)
      .tagArray()
      .sortArray(sortDesc, sortedColumn)
      .filterArray(selected, filter).array;
  };

  const toggleSelected = (id: number) => {
    const newSelected = [...selected];
    // check if the entry id is already present the selected entries
    // if yes remove it, otherwise add it
    const index = selected.indexOf(id);
    if (index !== -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(id);
    }
    onSelectedChange(newSelected);
  };

  const getMainCheckStatus = () => {
    if (selected.length === 0) {
      return false;
    }
    if (selected.length === entries.length) {
      return true;
    }
    return undefined;
  };

  const onMainCheck = () => {
    const current = getMainCheckStatus();
    if (!current) {
      const newSelected = [];
      for (let i = 0; i < entries.length; i++) {
        newSelected.push(i);
      }
      onSelectedChange(newSelected);
    } else {
      onSelectedChange([]);
    }
  };

  const getRowColor = (entry: PSResult) => {
    for (const [pattern, color] of Object.entries(colorSettings)) {
      const patterns = pattern.split("|");
      const entryValues = Object.values(entry).map((v) => stringify(v));

      console.log(patterns, entryValues);

      if (patterns.every((p) => entryValues.includes(p))) {
        // color + transparency
        return color + "70";
      }
    }
    return "transparent";
  };

  return (
    <table className="w-full whitespace-nowrap">
      <thead className="bg-elBg">
        <tr className="border-elFlatBorder border-b-2">
          <th className="px-2 border-elFlatBorder border-y">
            <div className="flex justify-center">
              <Checkbox checked={getMainCheckStatus()} onChange={onMainCheck} />
            </div>
          </th>
          {columns.map((column, index) => {
            return (
              <th key={index} className="p-0 border-elFlatBorder border">
                <Button
                  className="border-0 rounded-none flex items-center justify-between py-1 px-4 w-full"
                  onClick={() => onHeaderClick(column)}
                >
                  <span>{columnNames[column] ?? column}</span>
                  <BsCaretDownFill
                    className={
                      "ml-2 text-base " +
                      (sortDesc ? " " : "rotate-180 ") +
                      (sortedColumn === column ? "scale-100" : "scale-0")
                    }
                  />
                </Button>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {getFinalEntries().map((entry) => {
          return (
            <tr
              key={entry.__id__}
              className="hover:bg-lightBg"
              style={{ backgroundColor: getRowColor(entry) }}
            >
              <td className="relative group px-2 border-elFlatBorder border-y">
                <Checkbox
                  checked={selected.includes(entry.__id__ ?? -1)}
                  onChange={() => {
                    toggleSelected(entry.__id__ ?? -1);
                  }}
                />
              </td>
              {columns.map((column, index) => {
                return (
                  <td key={index} className="relative group px-2 border-elFlatBorder border">
                    <TableCell text={entry[column]} />
                    <RedirectButton
                      isVisible={!!onRedirect}
                      onClick={() => {
                        if (onRedirect) onRedirect(entry);
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
