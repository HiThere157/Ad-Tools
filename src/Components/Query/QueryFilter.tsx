import Button from "../Button";
import Input from "../Input/Input";

import { BsTrashFill } from "react-icons/bs";

type QueryFilterProps = {
  isLocked: boolean;
  filter: QueryFilter;
  setFilter: (filter: QueryFilter) => void;
  onRemoveFilter: () => void;
  onSubmit: () => void;
};
export default function QueryFilter({
  isLocked,
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
        disabled={isLocked}
        onChange={(property) => setFilter({ ...filter, property })}
        onEnter={onSubmit}
      />

      <span className="text-grey">=</span>

      <Input
        value={value ?? ""}
        disabled={isLocked}
        onChange={(value) => setFilter({ ...filter, value })}
        onEnter={onSubmit}
      />

      <Button className="p-1 text-red" disabled={isLocked} onClick={onRemoveFilter}>
        <BsTrashFill />
      </Button>
    </>
  );
}
