import { friendly } from "../../Config/lookup";

import Button from "../Button";
import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input/Input";
import MultiInput from "../Input/MultiInput";

import { BsTrashFill } from "react-icons/bs";

type TableFilterProps = {
  columns: string[];
  filter: TableFilter;
  setFilter: (filter: TableFilter) => void;
  removeFilter: () => void;
};
export default function TableFilter({
  columns,
  filter,
  setFilter,
  removeFilter,
}: TableFilterProps) {
  const { type, column, value } = filter;

  return (
    <>
      <Dropdown
        items={columns}
        value={column}
        onChange={(column) => setFilter({ ...filter, column })}
        replacer={friendly}
        className="w-full"
        disabled={columns.length === 0}
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
            const newValue = typeof value === "string" ? value.split(",") : [];
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

      <Button className="p-1 text-red" onClick={removeFilter}>
        <BsTrashFill />
      </Button>
    </>
  );
}
