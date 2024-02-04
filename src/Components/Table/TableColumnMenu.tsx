import { defaultTableColumn } from "../../Config/default";

import Button from "../Button";
import TableColumn from "./TableColumn";
import TableAvailableColumn from "./TableAvailableColumn";

import { BsPlusLg } from "react-icons/bs";

type TableColumnMenuProps = {
  allColumns: string[];
  columns: TableColumn[];
  setColumns: (columns: TableColumn[]) => void;
};
export default function TableColumnMenu({ allColumns, columns, setColumns }: TableColumnMenuProps) {
  const availableColumns = allColumns.filter(
    (column) => !columns.some((c) => c.name === column) && !column.startsWith("__"),
  );

  return (
    <div className="rounded border-2 border-border p-2">
      <h3 className="ms-2">Columns:</h3>

      <div className="flex items-start gap-1 pt-2">
        <div className="grid flex-grow grid-cols-[auto_1fr_1fr_auto] items-start gap-1">
          {columns.map((column, columnIndex) => (
            <TableColumn
              key={columnIndex}
              column={column}
              setColumn={(column) => {
                const newColumns = [...columns];
                newColumns[columnIndex] = column;
                setColumns(newColumns);
              }}
              onRemoveColumn={() => setColumns(columns.filter((_, i) => i !== columnIndex))}
            />
          ))}
        </div>

        <Button className="p-1" onClick={() => setColumns([...columns, defaultTableColumn])}>
          <BsPlusLg />
        </Button>
      </div>

      {availableColumns.length !== 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {availableColumns.map((column, columnIndex) => (
            <TableAvailableColumn
              key={columnIndex}
              columnName={column}
              onAdd={() => setColumns([...columns, { ...defaultTableColumn, name: column }])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
