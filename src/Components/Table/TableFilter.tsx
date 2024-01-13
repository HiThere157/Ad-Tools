import Button from "../Button";
import Input from "../Input/Input";
import MultiInput from "../Input/MultiInput";
import Dropdown from "../Dropdown/Dropdown";

import { BsTrashFill } from "react-icons/bs";

type TableFilterProps = {
  columns: TableColumn[];
  filter: TableFilter;
  setFilter: (filter: TableFilter) => void;
  onRemoveFilter: () => void;
};
export default function TableFilter({
  columns,
  filter,
  setFilter,
  onRemoveFilter,
}: TableFilterProps) {
  const { type, column, value } = filter;

  return (
    <>
      <Dropdown
        items={columns.map(({ name }) => name)}
        value={column}
        onChange={(column) => setFilter({ ...filter, column })}
        replacer={(name) => columns.find((column) => column.name === name)?.label ?? name}
        className="w-full"
      />

      <Dropdown
        items={["is", "in"]}
        value={type}
        onChange={(type) => {
          if (type === "is") {
            const newValue = Array.isArray(value) ? value.join(",") : "";
            setFilter({ ...filter, type, value: newValue });
          }
          if (type === "in") {
            const newValue =
              typeof value === "string" && value.trim() !== "" ? value.split(",") : [];
            setFilter({ ...filter, type, value: newValue });
          }
        }}
        className="w-full"
      />

      {type === "is" && (
        <Input value={value} onChange={(value) => setFilter({ ...filter, value })} />
      )}
      {type === "in" && (
        <MultiInput value={value} onChange={(value) => setFilter({ ...filter, value })} />
      )}

      <Button className="p-1 text-red" onClick={onRemoveFilter}>
        <BsTrashFill />
      </Button>
    </>
  );
}
