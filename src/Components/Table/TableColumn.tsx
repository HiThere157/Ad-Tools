import Button from "../Button";
import Input from "../Input/Input";

import { BsEyeFill, BsEyeSlashFill, BsTrashFill } from "react-icons/bs";

type TableColumnProps = {
  column: TableColumn;
  setColumn: (column: TableColumn) => void;
  onRemoveColumn: () => void;
};
export default function TableColumn({ column, setColumn, onRemoveColumn }: TableColumnProps) {
  const { isHidden, name, label } = column;

  return (
    <>
      <Button
        className="p-1"
        onClick={() => {
          setColumn({ ...column, isHidden: !isHidden });
        }}
      >
        {isHidden ? <BsEyeSlashFill className="text-grey" /> : <BsEyeFill />}
      </Button>

      <Input value={name} onChange={(name) => setColumn({ ...column, name })} />

      <Input value={label} onChange={(label) => setColumn({ ...column, label })} />

      <Button className="p-1 text-red" onClick={onRemoveColumn}>
        <BsTrashFill />
      </Button>
    </>
  );
}
