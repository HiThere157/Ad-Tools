import Button from "../Button";
import Input from "../Input/Input";

import { BsTrashFill } from "react-icons/bs";

type QueryFilterProps = {
  filter: QueryFilter;
  setFilter: (filter: QueryFilter) => void;
  onRemoveFilter: () => void;
};
export default function QueryFilter({ filter, setFilter, onRemoveFilter }: QueryFilterProps) {
  const { property, value } = filter;

  return (
    <>
      <Input value={property} onChange={(property) => setFilter({ ...filter, property })} />

      <span className="text-grey">=</span>

      <Input value={value ?? ""} onChange={(value) => setFilter({ ...filter, value })} />

      <Button className="p-1 text-red" onClick={onRemoveFilter}>
        <BsTrashFill />
      </Button>
    </>
  );
}
