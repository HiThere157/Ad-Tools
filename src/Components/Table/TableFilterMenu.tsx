import { defaultTableFilter } from "../../Config/default";

import Button from "../Button";
import TableFilter from "./TableFilter";

import { BsPlusLg } from "react-icons/bs";

type TableFilterMenuProps = {
  columns: string[];
  filters: TableFilter[];
  setFilters: (filter: TableFilter[]) => void;
};
export default function TableFilterMenu({ columns, filters, setFilters }: TableFilterMenuProps) {
  return (
    <div className="flex items-end gap-1 rounded border-2 border-border p-2">
      <div className="grid flex-grow grid-cols-[auto_auto_1fr_auto] items-start gap-1">
        {filters.map((filter, filterIndex) => (
          <TableFilter
            key={filterIndex}
            columns={columns}
            filter={filter}
            setFilter={(filter) => {
              const newFilters = [...filters];
              newFilters[filterIndex] = filter;
              setFilters(newFilters);
            }}
            onRemoveFilter={() => setFilters(filters.filter((_, i) => i !== filterIndex))}
          />
        ))}
      </div>

      <Button className="p-1" onClick={() => setFilters([...filters, defaultTableFilter])}>
        <BsPlusLg />
      </Button>
    </div>
  );
}
