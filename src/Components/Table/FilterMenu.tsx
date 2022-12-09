import { useLocalStorage } from "../../Hooks/useStorage";
import { ColumnDefinition } from "../../Config/default";

import Checkbox from "../Checkbox";
import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

import { BsFillPencilFill, BsPlusLg, BsFillTrashFill } from "react-icons/bs";
import { useEffect, useState } from "react";

type FilterMenuProps = {
  isOpen: boolean;
  columns: ColumnDefinition[];
  filter: { [key: string]: string };
  onFilterChange: (newFilter: { [key: string]: string }) => any;
  currentSavedFilter: string;
  setCurrentSavedFilter: (value: string) => any;
};
export default function FilterMenu({
  isOpen,
  columns,
  filter,
  onFilterChange,
  currentSavedFilter,
  setCurrentSavedFilter,
}: FilterMenuProps) {
  const [savedFilters, setSavedFilters] = useLocalStorage(
    "conf_savedFilters",
    {},
  );
  const [isEditing, setIsEditing] = useState(false);

  // when exiting edit mode, save empty names as "untitled"
  // prevent name collision
  useEffect(() => {
    if (isEditing) return;

    let newUniqueName = "untitled";
    while (Object.keys(savedFilters).includes(newUniqueName)) {
      newUniqueName = `_${newUniqueName}`;
    }
    const newFilterEntries = Object.entries(savedFilters).map(
      ([name, filter]) => [name === "" ? newUniqueName : name, filter],
    );
    setSavedFilters(Object.fromEntries(newFilterEntries));

    if (currentSavedFilter === "") setCurrentSavedFilter(newUniqueName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    onFilterChange(savedFilters[currentSavedFilter] ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSavedFilter]);

  // update the filter for the current editing saved filter
  const updateFilter = (key: string, filterString: string) => {
    const newFilter = { ...filter, [key]: filterString.trim() };
    Object.keys(newFilter).forEach(
      (key) => newFilter[key] === "" && delete newFilter[key],
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

  // change the name of the currently editing filter
  // while changing the name, prevent name collision
  const changeFilterName = (newName: string) => {
    let newUniqueName = newName;
    while (Object.keys(savedFilters).includes(newUniqueName)) {
      newUniqueName = `_${newUniqueName}`;
    }
    const newFilterEntries = Object.entries(savedFilters).map(
      ([name, filter]) => [
        name === currentSavedFilter ? newUniqueName : name,
        filter,
      ],
    );

    setSavedFilters(Object.fromEntries(newFilterEntries));
    setCurrentSavedFilter(newUniqueName);
  };

  // add empty filter with empty name to the saved filters
  const addFilter = () => {
    setSavedFilters({ ...savedFilters, "": {} });
    setCurrentSavedFilter("");
    setIsEditing(true);
  };

  const removeFilter = () => {
    const newSavedFilters = { ...savedFilters };
    delete newSavedFilters[currentSavedFilter];
    setSavedFilters(newSavedFilters);
    setCurrentSavedFilter("No Preset");
    setIsEditing(false);
  };

  return (
    <>
      {isOpen && (
        <div className="container py-1">
          <div className="flex mb-2">
            {isEditing ? (
              <Input
                value={currentSavedFilter}
                onChange={changeFilterName}
                onEnter={() => {
                  setIsEditing(!isEditing);
                }}
              />
            ) : (
              <Dropdown
                value={currentSavedFilter}
                items={[...Object.keys(savedFilters), "No Preset"]}
                onChange={setCurrentSavedFilter}
              />
            )}
            {currentSavedFilter !== "No Preset" && (
              <Button
                classOverride="p-1.5 text-xs ml-1"
                highlight={isEditing}
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <BsFillPencilFill />
              </Button>
            )}
            {isEditing && (
              <Button classOverride="p-1.5 text-xs ml-1" onClick={removeFilter}>
                <BsFillTrashFill />
              </Button>
            )}
            <Button classOverride="p-1.5 text-xs ml-1" onClick={addFilter}>
              <BsPlusLg />
            </Button>
          </div>
          <table className="border-separate border-spacing-0.5">
            <tbody>
              <tr>
                <td>
                  <span className="mr-1">Selected:</span>
                </td>
                <td>
                  <Checkbox
                    checked={filter.__selected__ === "true"}
                    onChange={() =>
                      updateFilter(
                        "__selected__",
                        filter.__selected__ !== "true" ? "true" : "",
                      )
                    }
                    disabled={!isEditing && currentSavedFilter !== "No Preset"}
                  />
                </td>
              </tr>
              {columns.map((column, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <span className="mr-1 whitespace-nowrap">{column.title}:</span>
                    </td>
                    <td>
                      <Input
                        value={filter[column.key]}
                        onChange={(filterString: string) =>
                          updateFilter(column.key, filterString)
                        }
                        classOverride="min-w-30"
                        disabled={
                          !isEditing && currentSavedFilter !== "No Preset"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
