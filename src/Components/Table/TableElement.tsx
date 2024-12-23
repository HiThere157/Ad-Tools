import { useMemo } from "react";

import { stringify } from "../../Helper/string";

import Checkbox from "../Checkbox";
import TableCell from "./TableCell";

import { BsCaretDownFill } from "react-icons/bs";

type TableElementProps = {
  data: ResultObject[];
  columns: TableColumn[];
  sort: SortConfig;
  setSort: (sort: SortConfig) => void;
  allRowIds: number[];
  selected: number[];
  setSelected: (selected: number[]) => void;
  redirectColumn?: string;
  onRedirect?: (row: ResultObject, newTab?: boolean) => void;
};
export default function TableElement({
  data,
  columns,
  sort,
  setSort,
  allRowIds,
  selected,
  setSelected,
  redirectColumn,
  onRedirect,
}: TableElementProps) {
  const mainCheckState = useMemo(() => {
    const rowsSelected = allRowIds.map((id) => selected.includes(id));

    // If all rows are selected, return true
    if (rowsSelected.every((row) => row) && data.length != 0) return true;
    // If some rows are selected, return undefined
    if (rowsSelected.some((row) => row)) return undefined;

    // If no rows are selected, return false
    return false;
  }, [allRowIds, data, selected]);

  const onSort = (column: string) => {
    if (sort.column === column) {
      // Column is already sorted, so we cycle through the direction
      if (sort.direction === "asc") {
        setSort({ column, direction: "desc" });
      }

      if (sort.direction === "desc") {
        setSort({ column: "__id__", direction: "asc" });
      }
    } else {
      // Column is not sorted, so we sort it ascending
      setSort({ column, direction: "asc" });
    }
  };

  const onSelect = (id: number) => {
    if (selected.includes(id)) {
      // Row is already selected, so we deselect it
      setSelected(selected.filter((selectedId) => selectedId !== id));
    } else {
      // Row is not selected, so we add it to the selection
      setSelected([...selected, id]);
    }
  };

  const onAllSelect = () => {
    if (mainCheckState) {
      // All rows are selected, so we deselect all rows
      setSelected([]);
    }

    if (!mainCheckState) {
      // No or some rows are selected, so we add all rows to the selection
      setSelected(allRowIds);
    }
  };

  return (
    <table className="w-full">
      <thead className="bg-primary">
        <tr className="border-b-2 border-border">
          <th className="w-6 px-2 py-1">
            <Checkbox checked={mainCheckState} onChange={onAllSelect} />
          </th>

          {columns
            .filter(({ isHidden }) => !isHidden)
            .map(({ name, label }, columnIndex) => (
              <th key={columnIndex} className="border-s border-border">
                <button
                  className="flex w-full items-center justify-between gap-2 rounded px-2 outline-none outline-offset-0 focus-visible:outline-borderActive"
                  onClick={() => onSort(name)}
                >
                  {label}

                  {sort.column === name && (
                    <BsCaretDownFill className={sort.direction === "asc" ? "rotate-180" : ""} />
                  )}
                </button>
              </th>
            ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr
            key={row.__id__}
            style={{
              backgroundColor: row.__highlight_bg__ ?? "transparent",
              color: row.__highlight_fg__ ?? "inherit",
            }}
          >
            <td className="border-t border-border px-2">
              <Checkbox
                checked={selected.includes(row.__id__)}
                onChange={() => {
                  onSelect(row.__id__);
                }}
              />
            </td>

            {columns
              .filter(({ isHidden }) => !isHidden)
              .map(({ name }, columnIndex) => (
                <td
                  key={columnIndex}
                  className="whitespace-pre border-s border-t border-border px-2"
                >
                  <TableCell
                    content={stringify(row[name])}
                    canRedirect={name === redirectColumn}
                    onRedirect={(newTab) => onRedirect?.(row, newTab)}
                  />
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
