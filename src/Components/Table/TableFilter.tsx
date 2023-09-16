import { friendly } from "../../Config/lookup";

import Button from "../Button";
import Dropdown from "../Dropdown";
import Input from "../Input";

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
  const operators = ["is", "is not", "in", "not in"];
  const { column, operator, value } = filter;

  return (
    <>
      <Dropdown
        items={columns}
        value={column}
        onChange={(column) => setFilter({ ...filter, column })}
        replacer={friendly}
      />
      <Dropdown
        items={operators}
        value={operator}
        onChange={(operator) => setFilter({ ...filter, operator })}
      />
      <Input value={value} onChange={() => setFilter({ ...filter, value })} />
      <Button className="p-1 text-red" onClick={removeFilter}>
        <BsTrashFill />
      </Button>
    </>
  );
}
