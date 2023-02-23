import { useEffect, useState } from "react";
import { useLocalStorage } from "../../Hooks/useStorage";

import Checkbox from "../Checkbox";
import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";
import Title from "../Title";

import { BsFillPencilFill, BsPlusLg, BsFillTrashFill } from "react-icons/bs";

type FilterMenuProps = {
  isOpen: boolean;
  columns: ColumnDefinition[];
  customColumns: string[];
  setCustomColumns?: (newColumns: string[]) => any;
  filter: Filter;
  setFilter: (newFilter: Filter) => any;
  currentSavedFilter: string;
  setCurrentSavedFilter: (value: string) => any;
};
export default function FilterMenu({
  isOpen,
  columns,
  customColumns,
  setCustomColumns,
  filter,
  setFilter,
  currentSavedFilter,
  setCurrentSavedFilter,
}: FilterMenuProps) {
  const [savedFilters, setSavedFilters] = useLocalStorage<{
    [key: string]: Filter;
  }>("conf_savedFilters", {});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nextColName, setNextColName] = useState<string>("");

  // when exiting edit mode, save empty names as "untitled"
  // prevent name collision
  useEffect(() => {
    if (isEditing) return;

    let newUniqueName = "untitled";
    while (Object.keys(savedFilters).includes(newUniqueName)) {
      newUniqueName = `_${newUniqueName}`;
    }
    const newFilterEntries = Object.entries(savedFilters).map(([name, filter]) => [
      name === "" ? newUniqueName : name,
      filter,
    ]);
    setSavedFilters(Object.fromEntries(newFilterEntries));

    if (currentSavedFilter === "") setCurrentSavedFilter(newUniqueName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    // is executed on mount, check if no saved filter is selected
    // and use last unnamed filter
    if (currentSavedFilter === "No Preset") {
      setFilter(filter);
    } else {
      // when changing saved filters, send filter update
      setFilter(savedFilters[currentSavedFilter] ?? {});
    }

    // if filter reset from ActionMenu, disable editing
    if (currentSavedFilter === "No Preset") setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSavedFilter]);

  // update the filter for the current editing saved filter
  const updateFilter = (key: string, filterString: string) => {
    const newFilter = { ...filter, [key]: filterString.trim() };

    if (isEditing) {
      const newSavedFilters = { ...savedFilters };
      if (newSavedFilters[currentSavedFilter]) {
        newSavedFilters[currentSavedFilter] = newFilter;
      }
      setSavedFilters(newSavedFilters);
    }

    setFilter(newFilter);
  };

  // add new custom column to the filter object
  const addColumn = (key: string) => {
    if (!key) return;
    if (columns.some((column) => column.key === key)) return;
    if (customColumns.includes(key)) return;

    setCustomColumns?.([...customColumns, key]);
    setNextColName("");
  };

  // remove a custom column from the filter object
  const removeColumn = (key: string) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    setCustomColumns?.(customColumns.filter((column) => column !== key));
    setFilter(newFilter);
  };

  // change the name of the currently editing filter
  // while changing the name, prevent name collision
  const changeSavedFilterName = (newName: string) => {
    let newUniqueName = newName;
    while (Object.keys(savedFilters).includes(newUniqueName)) {
      newUniqueName = `_${newUniqueName}`;
    }
    const newFilterEntries = Object.entries(savedFilters).map(([name, filter]) => [
      name === currentSavedFilter ? newUniqueName : name,
      filter,
    ]);

    setSavedFilters(Object.fromEntries(newFilterEntries));
    setCurrentSavedFilter(newUniqueName);
  };

  // add empty filter with empty name to the saved filters
  const addSavedFilter = () => {
    setSavedFilters({ ...savedFilters, "": {} });
    setCurrentSavedFilter("");
    setIsEditing(true);
  };

  const removeSavedFilter = () => {
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
          <div className="flex items-center mb-2">
            <span className="ml-1 mr-2">Preset:</span>
            {isEditing ? (
              <Input
                value={currentSavedFilter}
                onChange={changeSavedFilterName}
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
              <Title text="Edit Preset" position="bottom">
                <Button
                  classList="p-1.5 text-xs ml-1"
                  highlight={isEditing}
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                >
                  <BsFillPencilFill />
                </Button>
              </Title>
            )}
            {isEditing ? (
              <Title text="Delete Preset" position="bottom">
                <Button classList="p-1.5 text-xs ml-1" onClick={removeSavedFilter}>
                  <BsFillTrashFill />
                </Button>
              </Title>
            ) : (
              <Title text="Create Preset" position="bottom">
                <Button classList="p-1.5 text-xs ml-1" onClick={addSavedFilter}>
                  <BsPlusLg />
                </Button>
              </Title>
            )}
          </div>

          <hr className="my-1 dark:border-elFlatBorder"></hr>

          <table className="border-separate border-spacing-0.5 w-full">
            <tbody>
              <tr>
                <td>
                  <span className="mr-1">Selected:</span>
                </td>
                <td>
                  <Checkbox
                    checked={filter.__selected__ === "true"}
                    onChange={() =>
                      updateFilter("__selected__", filter.__selected__ !== "true" ? "true" : "")
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
                        onChange={(filterString: string) => updateFilter(column.key, filterString)}
                        classList="min-w-[10rem]"
                        disabled={!isEditing && currentSavedFilter !== "No Preset"}
                      />
                    </td>
                  </tr>
                );
              })}

              {customColumns.length > 0 && (
                <tr>
                  <td colSpan={2}>
                    <hr className="my-1 dark:border-elFlatBorder"></hr>
                  </td>
                </tr>
              )}

              {customColumns.map((key, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <span className="mr-1 whitespace-nowrap">{key}:</span>
                    </td>
                    <td>
                      <div className="flex items-center w-full [&>*:first-child]:w-full">
                        <Input
                          value={filter[key]}
                          onChange={(filterString: string) => updateFilter(key, filterString)}
                          disabled={!isEditing && currentSavedFilter !== "No Preset"}
                        />
                        <Title text="Remove Column" position="right">
                          <Button
                            classList="p-1.5 text-xs ml-1"
                            onClick={() => {
                              removeColumn(key);
                            }}
                          >
                            <BsFillTrashFill />
                          </Button>
                        </Title>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr className="my-1 dark:border-elFlatBorder"></hr>

          <div className="flex items-center mt-2">
            <span className="ml-1 mr-2 whitespace-nowrap">Add Column:</span>
            <Input
              value={nextColName}
              onChange={setNextColName}
              onEnter={() => {
                addColumn(nextColName);
              }}
              disabled={!setCustomColumns}
            />
            <Title text="Add Column" position="right">
              <Button
                classList="p-1.5 text-xs mx-1"
                onClick={() => {
                  addColumn(nextColName);
                }}
                disabled={!setCustomColumns}
              >
                <BsPlusLg />
              </Button>
            </Title>
          </div>
        </div>
      )}
    </>
  );
}
