import { tableFilter } from "../../Config/default";

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
      <div className="grid flex-grow grid-cols-[auto_1fr_auto] items-center gap-1">
        {filters.map((filter, index) => (
          <TableFilter
            key={index}
            columns={columns}
            filter={filter}
            setFilter={(filter) => {
              const newFilters = [...filters];
              newFilters[index] = filter;
              setFilters(newFilters);
            }}
            removeFilter={() => setFilters(filters.filter((_, i) => i !== index))}
          />
        ))}
      </div>

      <Button className="p-1" onClick={() => setFilters([...filters, tableFilter])}>
        <BsPlusLg />
      </Button>
    </div>
  );
}
