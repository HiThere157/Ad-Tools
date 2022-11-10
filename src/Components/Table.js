import { useSessionStorage } from "../Helper/useStorage";

import Button from "../Components/Button";
import Input from "../Components/Input";
import Expandable from "../Components/Expandable";

import {
  BsCaretDownFill,
  BsFunnel,
  BsArrowCounterclockwise,
  BsClipboard,
  BsExclamationOctagon,
} from "react-icons/bs";
import { useEffect, useState } from "react";

export default function Table({ name, columns, entries, error }) {
  const [sortedColumn, setSortedColumn] = useSessionStorage(
    name + "_sortedColumn",
    ""
  );
  const [sortDesc, setSortDesc] = useSessionStorage(name + "_sortDesc", true);
  const [filter, setFilter] = useSessionStorage(name + "_filter", {});

  const [isFilterOpen, setIsFilterOpen] = useSessionStorage(
    name + "_isFilterOpen",
    false
  );

  const [isCopyHighlighted, setIsCopyHighlighted] = useState(false);
  const [isFilterHighlighted, setIsFilterHighlighted] = useState(false);

  const updateSortArguments = (key) => {
    if (sortedColumn === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortedColumn(key);
      setSortDesc(true);
    }
  };

  const updateFilter = (key, filterString) => {
    const newFilter = { ...filter, [key]: filterString.trim() };
    Object.keys(newFilter).forEach(
      (key) => newFilter[key] === "" && delete newFilter[key]
    );
    setFilter(newFilter);
  };

  useEffect(() => {
    setIsFilterHighlighted(Object.keys(filter).length !== 0);
  }, [filter]);

  const resetTable = () => {
    setSortedColumn("");
    setSortDesc(true);
    setFilter({});
  };

  const copyToClip = () => {
    let ret = "";
    entries.forEach((entry) => {
      ret += columns.map((column) => entry[column.key]).join("\u{9}") + "\n";
    });
    navigator.clipboard.writeText(ret);

    if (isCopyHighlighted) return;
    setIsCopyHighlighted(true);
    setTimeout(() => {
      setIsCopyHighlighted(false);
    }, 5000);
  };

  return (
    <div className="flex space-x-1">
      <ActionMenu
        onResetTable={resetTable}
        onCopy={copyToClip}
        onFilter={() => {
          setIsFilterOpen(!isFilterOpen);
        }}
        isCopyHighlighted={isCopyHighlighted}
        isFilterHighlighted={isFilterHighlighted}
      />
      <FilterMenu
        isOpen={isFilterOpen}
        columns={columns}
        filter={filter}
        onFilterChange={updateFilter}
      />
      <div className="border-2 border-primaryBorder rounded-md overflow-hidden w-full">
        <TableElement
          entries={entries}
          columns={columns}
          sortDesc={sortDesc}
          sortedColumn={sortedColumn}
          filter={filter}
          onHeaderClick={updateSortArguments}
        />
        <NoItems isOpen={entries.length === 0 && !error} />
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}

function TableElement({
  entries,
  columns,
  sortDesc,
  sortedColumn,
  filter,
  onHeaderClick,
}) {
  const sortArray = (array) => {
    return array.slice().sort((a, b) => {
      if (!sortDesc) {
        [a, b] = [b, a];
      }
      if (typeof a === "number" && typeof b === "number") {
        return a[sortedColumn] - b[sortedColumn];
      } else {
        return b[sortedColumn]?.toString().localeCompare(a[sortedColumn]);
      }
    });
  };

  const filterArray = (array) => {
    return array.filter((entry) => {
      let isMatch = true;
      Object.entries(filter).forEach(([key, value]) => {
        const wildcard = value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(
          `^${wildcard.replace(/\*/g, ".*").replace(/\?/g, ".")}$`,
          "i"
        );
        if (!regex.test(entry[key])) {
          isMatch = false;
        }
      });

      return isMatch;
    });
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((column, index) => {
            return (
              <th
                key={index}
                className={
                  "p-0 whitespace-nowrap border-primaryBorder " +
                  (index === 0 ? "" : "border-l")
                }
              >
                <Button
                  classOverride="
                    disabled:opacity-100 border-0 rounded-none
                    flex items-center justify-between py-1 px-4 w-full
                  "
                  onClick={() => {
                    onHeaderClick(column.key);
                  }}
                  disabled={!column.sortable}
                >
                  <span>{column.title}</span>
                  <BsCaretDownFill
                    className={
                      "ml-2 text-base " +
                      (sortDesc ? " " : "rotate-180 ") +
                      (sortedColumn === column.key ? "scale-100" : "scale-0")
                    }
                  />
                </Button>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {filterArray(sortArray(entries)).map((entry, index) => {
          return (
            <tr key={index} className="dark:hover:bg-secondaryBg">
              {columns.map((column, index) => {
                return (
                  <td
                    key={index}
                    className={
                      "px-2 whitespace-nowrap dark:border-primaryBorder " +
                      (index === 0 ? "border-y" : "border")
                    }
                  >
                    <TableCell text={entry[column.key]} />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TableCell({ text }) {
  const stringify = (object) => {
    return JSON.stringify(object, null, 2);
  };

  switch (typeof text) {
    case "object":
      return (
        <Expandable canExpand={stringify(text)?.split("\n").length !== 1}>
          <pre>{stringify(text)}</pre>
        </Expandable>
      );

    case "boolean":
      return <>{text ? "True" : "False"}</>;

    default:
      return text;
  }
}

function NoItems({ isOpen }) {
  return (
    <>
      {isOpen ? (
        <div className="flex justify-center my-5">
          <span>No Items.</span>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function ErrorMessage({ error }) {
  return (
    <>
      {error.error ? (
        <div className="flex justify-center items-center space-x-2 my-5 mx-3 text-foregroundError">
          <BsExclamationOctagon className="text-2xl flex-shrink-0" />
          <span>{error.error}</span>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function ActionMenu({
  onResetTable,
  onCopy,
  onFilter,
  isCopyHighlighted,
  isFilterHighlighted,
}) {
  return (
    <div className="flex flex-col space-y-1">
      <Button
        classOverride="p-2"
        onClick={onFilter}
        highlight={isFilterHighlighted}
      >
        <BsFunnel />
      </Button>
      <Button classOverride="p-2" onClick={onResetTable}>
        <BsArrowCounterclockwise />
      </Button>
      <Button
        classOverride="p-2"
        onClick={onCopy}
        highlight={isCopyHighlighted}
      >
        <BsClipboard />
      </Button>
    </div>
  );
}

function FilterMenu({ isOpen, columns, filter, onFilterChange }) {
  return (
    <>
      {isOpen ? (
        <div className="px-1 border-2 outline-none rounded-md dark:bg-primaryControl dark:border-primaryBorder h-fit">
          {columns.map((column) => {
            return (
              <div className="mb-1" key={column.key}>
                <span className="ml-2 text-base">{column.title}:</span>
                <Input
                  value={filter[column.key]}
                  onChange={(filterString) => {
                    onFilterChange(column.key, filterString);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
