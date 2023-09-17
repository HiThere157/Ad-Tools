import { friendly } from "../../Config/lookup";

import Button from "../Button";
import Dropdown from "../Dropdown";

import { BsArrowCounterclockwise, BsFunnel, BsLayoutThreeColumns } from "react-icons/bs";

type TableActionsProps = {
  onReset: () => void;
  onFilterMenu: () => void;
  columns: string[];
  hiddenColumns: string[];
  setHiddenColumns: (hiddenColumns: string[]) => void;
};
export default function TableActions({
  onReset,
  onFilterMenu,
  columns,
  hiddenColumns,
  setHiddenColumns,
}: TableActionsProps) {
  const invertHiddenColumns = (hiddenColumns: string[]) => {
    return columns.filter((column) => !hiddenColumns.includes(column));
  };

  return (
    <div className="flex gap-1">
      <Button className="p-1" onClick={onReset}>
        <BsArrowCounterclockwise />
      </Button>
      <Button className="p-1" onClick={onFilterMenu}>
        <BsFunnel />
      </Button>
      <Dropdown
        items={columns}
        value={invertHiddenColumns(hiddenColumns)}
        onChangeMulti={(hiddenColumns) => setHiddenColumns(invertHiddenColumns(hiddenColumns))}
        replacer={friendly}
        className="p-1"
      >
        <BsLayoutThreeColumns />
      </Dropdown>
    </div>
  );
}
