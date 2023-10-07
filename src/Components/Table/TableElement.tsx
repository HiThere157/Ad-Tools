import { useMemo } from "react";

import { friendly } from "../../Config/lookup";
import { stringify } from "../../Helper/string";

import Button from "../Button";
import Checkbox from "../Checkbox";
import TableCell from "./TableCell";

import { BsCaretDownFill, BsSearch } from "react-icons/bs";

type TableElementProps = {
  data: PSResult[];
  columns: string[];
  sort: SortConfig;
  setSort: (sort: SortConfig) => void;
  allRowIds: number[];
  selected: number[];
  setSelected: (selected: number[]) => void;
  onRedirect?: (row: PSResult) => void;
};
export default function TableElement({
  data,
  columns,
  sort,
  setSort,
  allRowIds,
  selected,
  setSelected,
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
  }, [data, selected]);

  const onSort = (column: string) => {
    if (sort.column === column) {
      // Column is already sorted, so we reverse the direction
      setSort({
        column,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Column is not sorted, so we sort it ascending
      setSort({
        column,
        direction: "asc",
      });
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

          {columns.map((column, columnIndex) => (
            <th key={columnIndex} className="border-s border-border px-2">
              <button
                className="flex w-full items-center justify-between gap-2"
                onClick={() => onSort(column)}
              >
                {friendly(column)}

                {sort.column === column && (
                  <BsCaretDownFill className={sort.direction === "asc" ? "rotate-180" : ""} />
                )}
              </button>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.__id__}>
            <td className="border-t border-border px-2">
              <Checkbox
                checked={selected.includes(row.__id__)}
                onChange={() => {
                  onSelect(row.__id__);
                }}
              />
            </td>

            {columns.map((column, columnIndex) => (
              <td
                key={columnIndex}
                className="group relative whitespace-pre border-s border-t border-border px-2"
              >
                <TableCell content={stringify(row[column])} />

                {onRedirect && (
                  <Button
                    className="absolute right-1 top-1/2 hidden h-6 translate-y-[-50%] px-0.5 group-hover:block"
                    onClick={() => {
                      onRedirect(row);
                    }}
                  >
                    <BsSearch />
                  </Button>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
