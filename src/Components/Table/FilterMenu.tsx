import { useLocalStorage, useSessionStorage } from "../../Hooks/useStorage";
import { ColumnDefinition } from "../../Config/default";

import Checkbox from "../Checkbox";
import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

import { BsFillPencilFill, BsPlusLg, BsFillTrashFill } from "react-icons/bs";
import { useEffect, useState } from "react";

type FilterMenuProps = {
  name: string,
  isOpen: boolean,
  columns: ColumnDefinition[]
  filter: { [key: string]: string }
  onFilterChange: Function,
}
export default function FilterMenu({ name, isOpen, columns, filter, onFilterChange }: FilterMenuProps) {
  const [savedFilters, setSavedFilters] = useLocalStorage("conf_savedFilters", {});
  const [currentSavedFilter, setCurrentSavedFilter] = useSessionStorage(name + "_currentSavedFilter", "No Preset");
  const [isLocked, setIsLocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsLocked(currentSavedFilter !== "No Preset" && !isEditing);
    onFilterChange(savedFilters[currentSavedFilter] ?? {});
  }, [currentSavedFilter, isEditing]);

  const updateFilter = (key: string, filterString: string) => {
    const newFilter = { ...filter, [key]: filterString.trim() };
    Object.keys(newFilter).forEach(
      (key) => newFilter[key] === "" && delete newFilter[key]
    );

    if (isEditing) {
      const newSavedFilters = { ...savedFilters };
      if (newSavedFilters[currentSavedFilter]) {
        newSavedFilters[currentSavedFilter] = newFilter;
      }
      setSavedFilters(newSavedFilters);
    }

    onFilterChange(newFilter);
  };

  const changeFilterName = (newName: string) => {
    const newFilterEntries = Object.entries(savedFilters).map(
      ([name, filter]) => [name === currentSavedFilter ? newName : name, filter]
    );
    setSavedFilters(Object.fromEntries(newFilterEntries));
    setCurrentSavedFilter(newName);
  }

  return (
    <>
      {isOpen && (
        <div className="container py-1">
          <div className="flex mb-3">
            {isEditing ? (
              <Input value={currentSavedFilter} onChange={changeFilterName} />
            ) : (
              <Dropdown value={currentSavedFilter} items={[...Object.keys(savedFilters), "No Preset"]} onChange={setCurrentSavedFilter} />
            )}
            {currentSavedFilter !== "No Preset" && (
              <Button classOverride="p-1.5 text-xs ml-1" highlight={isEditing} onClick={() => { setIsEditing(!isEditing) }}>
                <BsFillPencilFill />
              </Button>
            )}
            {isEditing && (
              <Button classOverride="p-1.5 text-xs ml-1" onClick={() => { }}>
                <BsFillTrashFill />
              </Button>
            )}
            <Button classOverride="p-1.5 text-xs ml-1" onClick={() => { }}>
              <BsPlusLg />
            </Button>
          </div>
          <div className=" grid grid-cols-[auto_1fr] gap-1">
            <span className="mr-2">Selected: </span>
            <Checkbox
              checked={filter.__selected__ === "true"}
              onChange={() => updateFilter("__selected__", filter.__selected__ !== "true" ? "true" : "")}
              disabled={isLocked}
            />
            {columns.map((column) => {
              return (
                <>
                  <span className="mr-2">{column.title}:</span>
                  <Input
                    value={filter[column.key]}
                    onChange={(filterString: string) => updateFilter(column.key, filterString)}
                    disabled={isLocked}
                  />
                </>
              );
            })}
          </div>
        </div>
      )
      }
    </>
  );
}