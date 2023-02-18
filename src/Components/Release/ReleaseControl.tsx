import Button from "../Button";
import Dropdown from "../Dropdown";

import { BsArrowRepeat } from "react-icons/bs";

type ReleaseControlProps = {
  filter: string;
  filterOptions: string[];
  onFilterChange: (filter: string) => any;
  onRefresh: () => any;
};
export default function ReleaseControl({
  filter,
  filterOptions,
  onFilterChange,
  onRefresh,
}: ReleaseControlProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl">
      <Dropdown items={filterOptions} value={filter} onChange={onFilterChange} />
      <Button classList="p-1.5" onClick={onRefresh}>
        <BsArrowRepeat />
      </Button>
    </div>
  );
}
