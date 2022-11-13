import { ColumnDefinition } from "../../Config/default";
import Button from "../Button";
import TableCell from "./TableCell";
import RedirectButton from "./RedirectButton";

import { BsCaretDownFill } from "react-icons/bs";

type TableElementProps = {
  entries?: { [key: string]: any }[],
  columns: ColumnDefinition[],
  sortDesc: boolean,
  sortedColumn: string,
  filter: { [key: string]: string },
  onHeaderClick: Function,
  onRedirect?: Function
}
export default function TableElement({
  entries = [],
  columns,
  sortDesc,
  sortedColumn,
  filter,
  onHeaderClick,
  onRedirect,
}: TableElementProps) {
  const stringify = (anything: any) => {
    if (typeof anything === "object") {
      return JSON.stringify(anything);
    }

    return anything;
  };

  const sortArray = (array: { [key: string]: any }[]) => {
    return array.slice().sort((a, b) => {
      if (!sortDesc) {
        [a, b] = [b, a];
      }
      if (typeof a === "number" && typeof b === "number") {
        return a[sortedColumn] - b[sortedColumn];
      } else {
        return b[sortedColumn]?.toString().localeCompare(a[sortedColumn].toString());
      }
    });
  };

  const filterArray = (array: { [key: string]: number | string | object }[]) => {
    return array.filter((entry) => {
      let isMatch = true;
      Object.entries(filter).forEach(([key, value]) => {
        const wildcard = value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(
          `^${wildcard.replace(/\*/g, ".*").replace(/\?/g, ".")}$`,
          "i"
        );
        if (!regex.test(stringify(entry[key]))) {
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
                      "relative group px-2 whitespace-nowrap dark:border-primaryBorder " +
                      (index === 0 ? "border-y" : "border")
                    }
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
