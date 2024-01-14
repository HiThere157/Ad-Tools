import { defaultTableColumn } from "../../Config/default";

import Button from "../Button";
import TableColumn from "./TableColumn";

import { BsPlusLg } from "react-icons/bs";

type TableColumnMenuProps = {
  columns: TableColumn[];
  setColumns: (columns: TableColumn[]) => void;
};
export default function TableColumnMenu({ columns, setColumns }: TableColumnMenuProps) {
  return (
    <div className="rounded border-2 border-border">
      <h3 className="me-2 ms-4 mt-2 text-lg font-bold">Columns:</h3>

      <div className="flex items-start gap-1 p-2">
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
    </div>
  );
}
