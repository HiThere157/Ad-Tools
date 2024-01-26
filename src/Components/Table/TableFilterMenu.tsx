import { useState } from "react";
import { useDispatch } from "react-redux";

import { defaultTableFilter } from "../../Config/default";
import { pushToast } from "../../Redux/dataSlice";

import Button from "../Button";
import Dropdown from "../Dropdown/Dropdown";
import Prompt from "../Popup/Prompt";
import Confirm from "../Popup/Confirm";
import TableFilter from "./TableFilter";

import { BsPencilFill, BsPlusLg, BsSave, BsTrashFill } from "react-icons/bs";

type TableFilterMenuProps = {
  columns: TableColumn[];
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const dispatch = useDispatch();

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
          <>
            <Button className="p-1" onClick={() => setIsRenameOpen(true)}>
              <BsPencilFill />
            </Button>

            <Button className="p-1 text-red" onClick={() => setIsDeleteOpen(true)}>
              <BsTrashFill />
            </Button>
          </>
        ) : (
          <Button className="p-1" onClick={() => setIsCreateOpen(true)}>
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

      <Prompt
        isOpen={isCreateOpen}
        title="Create new Saved Filter"
        label="Name:"
        onExit={(value) => {
          setIsCreateOpen(false);
          if (!value) return;

          const sameNameCount = savedFilters.filter((filter) => filter.name === value).length;
          const uniqueName = sameNameCount === 0 ? value : `${value} (${sameNameCount})`;

          setSavedFilters([...savedFilters, { name: uniqueName, filters }], uniqueName);
          setFilters([]);

          dispatch(
            pushToast({ message: `Saved Filter "${uniqueName}" created.`, time: 7, type: "info" }),
          );
        }}
      />

      <Prompt
        isOpen={isRenameOpen}
        title="Rename Saved Filter"
        label="Name:"
        defaultValue={savedFilterName}
        onExit={(value) => {
          setIsRenameOpen(false);
          if (!value) return;

          const newSavedFilters = [...savedFilters];
          const index = newSavedFilters.findIndex((filter) => filter.name === savedFilterName);

          const sameNameCount = savedFilters.filter((filter) => filter.name === value).length;
          const uniqueName = sameNameCount === 0 ? value : `${value} (${sameNameCount})`;

          newSavedFilters[index] = { name: uniqueName, filters };
          setSavedFilters(newSavedFilters, uniqueName);

          dispatch(
            pushToast({ message: `Saved Filter "${uniqueName}" renamed.`, time: 7, type: "info" }),
          );
        }}
      />

      <Confirm
        isOpen={isDeleteOpen}
        title="Delete Saved Filter"
        message="Are you sure you want to delete this Saved Filter?"
        onExit={(selection) => {
          setIsDeleteOpen(false);

          if (selection) {
            setSavedFilters(savedFilters.filter((filter) => filter.name !== savedFilterName));

            dispatch(
              pushToast({
                message: `Saved Filter "${savedFilterName}" deleted.`,
                time: 7,
                type: "info",
              }),
            );
          }
        }}
      />
    </div>
  );
}
