import Button from "../Button";
import Input from "../Input/Input";

import { BsTrashFill } from "react-icons/bs";

type TableColumnProps = {
  column: TableColumn;
  setColumn: (column: TableColumn) => void;
  onRemoveColumn: () => void;
};
export default function TableColumn({ column, setColumn, onRemoveColumn }: TableColumnProps) {
  const { name, label } = column;

  return (
    <>
      <Input value={name} onChange={(name) => setColumn({ ...column, name })} />

      <Input value={label} onChange={(label) => setColumn({ ...column, label })} />

      <Button className="p-1 text-red" onClick={onRemoveColumn}>
        <BsTrashFill />
      </Button>
    </>
  );
}
