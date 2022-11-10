import Button from "../Button";
import Expandable from "../Expandable";

import { BsCaretDownFill, BsExclamationOctagon } from "react-icons/bs";

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

export { TableElement, NoItems, ErrorMessage };
