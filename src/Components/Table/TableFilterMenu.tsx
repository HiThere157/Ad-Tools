import { defaultTableFilter } from "../../Config/default";

import Button from "../Button";
import Dropdown from "../Dropdown/Dropdown";
import TableFilter from "./TableFilter";

import { BsPlusLg, BsSave, BsTrashFill } from "react-icons/bs";

type TableFilterMenuProps = {
  columns: string[];
  filters: TableFilter[];
  setFilters: (filter: TableFilter[]) => void;
  savedFilters: SavedTableFilter[];
  setSavedFilters: (savedFilters: SavedTableFilter[], savedFilterName?: string) => void;
  savedFilterName?: string;
  setSavedFilterName: (savedFilterName?: string) => void;
};
export default function TableFilterMenu({
  columns,
  filters,
  setFilters,
  savedFilters,
  setSavedFilters,
  savedFilterName,
  setSavedFilterName,
}: TableFilterMenuProps) {
  const setCurrentFilters = (filters: TableFilter[]) => {
    if (savedFilterName) {
      const newSavedFilters = [...savedFilters];
      const index = newSavedFilters.findIndex((filter) => filter.name === savedFilterName);

      const savedFilter = { name: savedFilterName, filters };

      if (index === -1) {
        newSavedFilters.push(savedFilter);
      } else {
        newSavedFilters[index] = savedFilter;
      }

      setSavedFilters(newSavedFilters, savedFilterName);
    } else {
      setFilters(filters);
    }
  };

  return (
    <div className="rounded border-2 border-border">
      <div className="me-2 ms-4 mt-2 flex items-center justify-between gap-1">
        <h3 className="text-lg font-bold">Filters:</h3>

        <div className="flex-grow" />

        <Dropdown
          items={["No Preset", ...savedFilters.map((filter) => filter.name)]}
          value={savedFilterName ?? "No Preset"}
          onChange={(savedFilterName) => {
            if (savedFilterName === "No Preset") {
              setSavedFilterName(undefined);
            } else {
              setSavedFilterName(savedFilterName);
            }
          }}
        />

        {savedFilterName ? (
          <Button
            className="p-1 text-red"
            onClick={() =>
              setSavedFilters(savedFilters.filter((filter) => filter.name !== savedFilterName))
            }
          >
            <BsTrashFill />
          </Button>
        ) : (
          <Button
            className="p-1"
            onClick={() => {
              const tempName = new Date().toLocaleString();
              setSavedFilters([...savedFilters, { name: tempName, filters }], tempName);
              setFilters([]);
            }}
          >
            <BsSave />
          </Button>
        )}
      </div>

      <div className="flex items-start gap-1 p-2">
        <div className="grid flex-grow grid-cols-[auto_auto_1fr_auto] items-start gap-1">
          {filters.map((filter, filterIndex) => (
            <TableFilter
              key={filterIndex}
              columns={columns}
              filter={filter}
              setFilter={(filter) => {
                const newFilters = [...filters];
                newFilters[filterIndex] = filter;
                setCurrentFilters(newFilters);
              }}
              onRemoveFilter={() => setCurrentFilters(filters.filter((_, i) => i !== filterIndex))}
            />
          ))}
        </div>

        <Button className="p-1" onClick={() => setCurrentFilters([...filters, defaultTableFilter])}>
          <BsPlusLg />
        </Button>
      </div>
    </div>
  );
}
