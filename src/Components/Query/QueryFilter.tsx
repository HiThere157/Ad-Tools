import Button from "../Button";
import Input from "../Input/Input";

import { BsTrashFill } from "react-icons/bs";

type QueryFilterProps = {
  filter: QueryFilter;
  setFilter: (filter: QueryFilter) => void;
  onRemoveFilter: () => void;
  onSubmit: () => void;
};
export default function QueryFilter({
  filter,
  setFilter,
  onRemoveFilter,
  onSubmit,
}: QueryFilterProps) {
  const { property, value } = filter;

  return (
    <>
      <Input
        value={property}
        onChange={(property) => setFilter({ ...filter, property })}
        onEnter={onSubmit}
      />

      <span className="text-grey">=</span>

      <Input
        value={value ?? ""}
        onChange={(value) => setFilter({ ...filter, value })}
        onEnter={onSubmit}
      />

      <Button className="p-1 text-red" onClick={onRemoveFilter}>
        <BsTrashFill />
      </Button>
    </>
  );
}
