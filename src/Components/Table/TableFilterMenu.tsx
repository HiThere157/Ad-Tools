import { tableFilter } from "../../Config/default";
import { friendly } from "../../Config/lookup";

import Button from "../Button";
import Checkbox from "../Checkbox";
import TableFilter from "./TableFilter";

type TableFilterMenuProps = {
  columns: string[];
  hiddenColumns: string[];
  setHiddenColumns: (hiddenColumns: string[]) => void;
  filters: TableFilter[];
  setFilters: (filter: TableFilter[]) => void;
};
export default function TableFilterMenu({
  columns,
  hiddenColumns,
  setHiddenColumns,
  filters,
  setFilters,
}: TableFilterMenuProps) {
  const onColumnToggle = (column: string) => {
    if (hiddenColumns.includes(column)) {
      // Column is already hidden, so we remove it from the hidden columns
      setHiddenColumns(hiddenColumns.filter((c) => c !== column));
    } else {
      // Column is not hidden, so we add it to the hidden columns
      setHiddenColumns([...hiddenColumns, column]);
    }
  };

  return (
    <div className="flex gap-3 rounded border-2 border-border p-2">
      <div>
        {columns.map((column) => (
          <label key={column} className="flex items-center gap-1.5">
            <Checkbox
              checked={!hiddenColumns.includes(column)}
              onChange={() => onColumnToggle(column)}
            />

            <span>{friendly(column)}</span>
          </label>
        ))}
      </div>

      <div className="border-l-2 border-border" />

      <div>
        <div className="grid grid-cols-[auto_auto_auto_auto] items-center gap-1">
          {filters.map((filter, index) => (
            <TableFilter
              key={index}
              columns={columns}
              filter={filter}
              setFilter={(filter) => {
                const newFilters = [...filters];
                newFilters[index] = filter;
                setFilters(newFilters);
              }}
              removeFilter={() => setFilters(filters.filter((_, i) => i !== index))}
            />
          ))}
        </div>

        <Button onClick={() => setFilters([...filters, tableFilter])}>+</Button>
      </div>
    </div>
  );
}
