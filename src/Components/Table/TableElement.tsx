import { ColumnDefinition } from "../../Config/default";
import stringify from "../../Helper/stringify";

import Button from "../Button";
import Checkbox from "../Checkbox";
import TableCell from "./TableCell";
import RedirectButton from "./RedirectButton";

import { BsCaretDownFill } from "react-icons/bs";
import { useEffect } from "react";

type TableElementProps = {
  entries?: { [key: string]: any }[];
  columns: ColumnDefinition[];
  sortDesc: boolean;
  sortedColumn: string;
  filter: { [key: string]: string };
  onFilter: (n: number) => void;
  selected: number[];
  onSelectedChange: (newSelected: number[]) => any;
  onHeaderClick: (header: string) => any;
  onRedirect?: (entry: { [key: string]: any }) => any;
};
export default function TableElement({
  entries = [],
  columns,
  sortDesc,
  sortedColumn,
  filter,
  onFilter,
  selected,
  onSelectedChange,
  onHeaderClick,
  onRedirect,
}: TableElementProps) {
  useEffect(() => {
    onFilter(entries.length - filterArray(sortArray(tagArray(entries))).length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, entries])

  const toggleSelected = (id: number) => {
    const newSelected = [...selected];
    // check if the entry id is already present the selected entries
    // if yes remove it, otherwise add it
    const index = selected.indexOf(id);
    if (index !== -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(id);
    }
    onSelectedChange(newSelected);
  };

  const tagArray = (array: { [key: string]: any }[]) => {
    // add a unique __id__ field to every entry. used to track selected entries
    return array.map((entry, index) => {
      return { __id__: index, ...entry };
    });
  };

  const sortArray = (array: { [key: string]: any }[]) => {
    return array.slice().sort((a, b) => {
      if (!sortDesc) {
        [a, b] = [b, a];
      }
      return stringify(b[sortedColumn]).localeCompare(
        stringify(a[sortedColumn]),
      );
    });
  };

  const filterArray = (array: { [key: string]: any }[]) => {
    return array.filter((entry) => {
      let isMatch = true;
      Object.entries(filter).forEach(([key, value]) => {
        // if __selected__ key is present in filter, check selected values
        // prevent regex check after
        if (key === "__selected__") {
          isMatch = selected.includes(entry.__id__);
          return;
        }

        // every other filter value is checked with the entry properties
        // split | and check every value seperately
        // if any value is true, entry is a match
        const matched = value
          .split("|")
          .map((value: string) => {
            const wildcard = value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(
              `^${wildcard.replace(/\*/g, ".*").replace(/\?/g, ".")}$`,
              "i",
            );
            return regex.test(stringify(entry[key], false));
          })
          .some((match) => match);

        if (!matched) {
          isMatch = false;
        }
      });

      return isMatch;
    });
  };

  const getMainCheckStatus = () => {
    if (selected.length === 0) {
      return false;
    }
    if (selected.length === entries.length) {
      return true;
    }
    return undefined;
  };

  const onMainCheck = () => {
    const current = getMainCheckStatus();
    if (!current) {
      const newSelected = [];
      for (let i = 0; i < entries.length; i++) {
        newSelected.push(i);
      }
      onSelectedChange(newSelected);
    } else {
      onSelectedChange([]);
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-2 whitespace-nowrap dark:bg-primaryControl dark:border-primaryBorder border-r">
            <div className="flex justify-center">
              <Checkbox checked={getMainCheckStatus()} onChange={onMainCheck} />
            </div>
          </th>
          {columns.map((column, index) => {
            return (
              <th
                key={index}
                className="p-0 whitespace-nowrap dark:border-primaryBorder border-r"
              >
                <Button
                  classOverride="
                    disabled:opacity-100 border-0 rounded-none
                    flex items-center justify-between py-1 px-4 w-full
                  "
                  onClick={() => onHeaderClick(column.key)}
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
        {filterArray(sortArray(tagArray(entries))).map((entry) => {
          return (
            <tr key={entry.__id__} className="dark:hover:bg-secondaryBg">
              <td className="relative group px-2 whitespace-nowrap dark:border-primaryBorder border-y">
                <Checkbox
                  checked={selected.includes(entry.__id__)}
                  onChange={() => {
                    toggleSelected(entry.__id__);
                  }}
                />
              </td>
              {columns.map((column, index) => {
                return (
                  <td
                    key={index}
                    className="relative group px-2 whitespace-nowrap dark:border-primaryBorder border"
                  >
                    <TableCell text={entry[column.key]} />
                    <RedirectButton
                      isVisible={!!onRedirect}
                      onClick={() => {
                        if (onRedirect) onRedirect(entry);
                      }}
                    />
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
