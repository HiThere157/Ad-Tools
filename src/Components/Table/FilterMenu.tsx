import { useEffect, useState } from "react";
import { useLocalStorage } from "../../Hooks/useStorage";

import { columnNames } from "../../Config/default";

import Button from "../Button";
import Title from "../Title";
import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input";
import Checkbox from "../Checkbox";
import Hint from "../InputBars/Hint";

import { BsFillPencilFill, BsPlusLg, BsFillTrashFill } from "react-icons/bs";

type FilterMenuProps = {
  isOpen: boolean;
  columns: string[];
  filter: Filter;
  setFilter: (newFilter: Filter) => any;
  currentSavedFilter: string;
  setCurrentSavedFilter: (value: string) => any;
};
export default function FilterMenu({
  isOpen,
  columns,
  filter,
  setFilter,
  currentSavedFilter,
  setCurrentSavedFilter,
}: FilterMenuProps) {
  const [savedFilters, setSavedFilters] = useLocalStorage<{
    [key: string]: Filter;
  }>("conf_savedFilters", {});
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
    if (currentSavedFilter === "No Preset") {
      // preserve state between tab changes
      setFilter(filter);
      setIsEditing(false);
    } else {
      // when changing saved filters, send filter update
      setFilter(savedFilters[currentSavedFilter] ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSavedFilter]);

  // update the filter for the current editing saved filter
  const updateFilter = (key: string, filterString: string) => {
    const newFilter = { ...filter, [key]: filterString.trim() };
    Object.keys(newFilter).forEach((key) => newFilter[key] === "" && delete newFilter[key]);

    if (isEditing) {
      const newSavedFilters = { ...savedFilters };
      if (newSavedFilters[currentSavedFilter]) {
        newSavedFilters[currentSavedFilter] = newFilter;
      }
      setSavedFilters(newSavedFilters);
    }

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

  // add remove filter from the saved filters
  const removeSavedFilter = () => {
    const newSavedFilters = { ...savedFilters };
    delete newSavedFilters[currentSavedFilter];
    setSavedFilters(newSavedFilters);

    // exit to unnamed filter after, override current filter
    setCurrentSavedFilter("No Preset");
    setFilter({});
    setIsEditing(false);
  };

  const updateCurrentSavedFilter = (newFilter: string) => {
    setCurrentSavedFilter(newFilter);

    // the current filter should be cleared when exiting a saved filter
    if (newFilter === "No Preset") setFilter({});
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
                onChange={updateCurrentSavedFilter}
              />
            )}
            {currentSavedFilter !== "No Preset" && (
              <Title text="Edit Preset" position="bottom">
                <Button
                  className="p-1.5 text-xs ml-1"
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
                <Button className="p-1.5 text-xs ml-1" onClick={removeSavedFilter}>
                  <BsFillTrashFill />
                </Button>
              </Title>
            ) : (
              <Title text="Create Preset" position="bottom">
                <Button className="p-1.5 text-xs ml-1" onClick={addSavedFilter}>
                  <BsPlusLg />
                </Button>
              </Title>
            )}
          </div>

          <hr className="my-1 border-elFlatBorder" />

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
                      <span className="mr-1 whitespace-nowrap">
                        {columnNames[column] ?? column}:
                      </span>
                    </td>
                    <td>
                      <Input
                        value={filter[column]}
                        onChange={(filterString: string) => updateFilter(column, filterString)}
                        className="min-w-[10rem]"
                        disabled={!isEditing && currentSavedFilter !== "No Preset"}
                      />
                    </td>
                  </tr>
                );
              })}

              {Object.keys(filter)
                .filter((key) => key !== "__selected__")
                .some((key) => !columns.includes(key)) && (
                <tr>
                  <td colSpan={2}>
                    <hr className="my-1 border-elFlatBorder" />

                    <Hint hint="Invalid Filters are ignored:" />
                  </td>
                </tr>
              )}

              {Object.keys(filter)
                .filter((key) => key !== "__selected__")
                .filter((key) => !columns.includes(key))
                .map((key, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <span className="mr-1 whitespace-nowrap">{columnNames[key] ?? key}:</span>
                      </td>
                      <td>
                        <Input
                          value={filter[key]}
                          onChange={(filterString: string) => updateFilter(key, filterString)}
                          className="min-w-[10rem]"
                          disabled={!isEditing}
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
