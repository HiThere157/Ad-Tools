import { useMemo } from "react";

import { filterData, sortData } from "../../Helper/array";
import { friendly } from "../../Config/lookup";
import { stringify } from "../../Helper/string";

import Checkbox from "../Checkbox";

import { BsCaretDownFill } from "react-icons/bs";

type TableElementProps = {
  data: PSResult;
  columns: string[];
  filters: TableFilter[];
  sort: SortConfig;
  setSort: (sort: SortConfig) => void;
  selected: number[];
  setSelected: (selected: number[]) => void;
};
export default function TableElement({
  data,
  columns,
  filters,
  sort,
  setSort,
  selected,
  setSelected,
}: TableElementProps) {
  const mainCheckState = useMemo(() => {
    const rowsSelected = data.map((row) => selected.includes(row.__id__));

    // If all rows are selected, return true
    if (rowsSelected.every((row) => row)) return true;
    // If some rows are selected, return undefined
    if (rowsSelected.some((row) => row)) return undefined;

    // If no rows are selected, return false
    return false;
  }, [data, selected]);

  const filteredData = useMemo(() => {
    return filterData(data, filters);
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return sortData(filteredData, sort);
  }, [filteredData, sort]);

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
    const rowsIds = data.map((row) => row.__id__);

    if (mainCheckState) {
      // All rows are selected, so we deselect all visible rows
      setSelected(selected.filter((selectedId) => !rowsIds.includes(selectedId)));
    }

    if (mainCheckState === false) {
      // No visible rows are selected, so we add all visible rows to the selection
      setSelected([...selected, ...rowsIds]);
    }

    if (mainCheckState === undefined) {
      // Some visible rows are selected, so we deselect all visible rows
      // before re-selecting all visible rows - to prevent double selection
      setSelected([...selected.filter((selectedId) => !rowsIds.includes(selectedId)), ...rowsIds]);
    }
  };

  return (
    <div className="overflow-hidden rounded border-2 border-border">
      <table className="w-full">
        <thead className="bg-primary">
          <tr className="border-b-2 border-border">
            <th className="px-2">
              <Checkbox checked={mainCheckState} onChange={onAllSelect} />
            </th>

            {columns.map((column, index) => (
              <th key={index} className="border-s border-border px-2">
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
          {sortedData.map((row) => (
            <tr key={row.__id__}>
              <td className="border-t border-border px-2">
                <Checkbox
                  checked={selected.includes(row.__id__)}
                  onChange={() => {
                    onSelect(row.__id__);
                  }}
                />
              </td>

              {columns.map((column, index) => (
                <td key={index} className="border-s border-t border-border px-2">
                  {stringify(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
