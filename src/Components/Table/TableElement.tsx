import { useEffect, useMemo, useState } from "react";

import { stringify } from "../../Helper/string";

import Checkbox from "../Checkbox";

import { BsCaretDownFill } from "react-icons/bs";

type TableElementProps = {
  result: Loadable<PSResult>;
  config: TableConfig;
  setConfig: (config: TableConfig) => void;
  setCount: (count: TableCount) => void;
};
export default function TableElement({ result, config, setConfig }: TableElementProps) {
  // Parameters that are used to process the result before displaying it
  const { sort, filter, pagination } = config;
  const [processedResult, setProcessedResult] = useState<PSResult>(result?.data ?? []);

  // Parameters that are used to display the result
  const { selectedRowIds, selectedColumns } = config;
  const [isMainCheckChecked, setIsMainCheckChecked] = useState<boolean | undefined>(
    false,
  );

  function toggleSort(column: string) {
    if (sort.sortedColumn === column) {
      return setConfig({
        ...config,
        sort: {
          ...sort,
          sortDirection: sort.sortDirection === "asc" ? "desc" : "asc",
        },
      });
    }

    setConfig({
      ...config,
      sort: { ...sort, sortedColumn: column, sortDirection: "desc" },
    });
  }

  function toggleSelect(checked: boolean, id: number) {
    const newSelectedRowIds = checked
      ? [...selectedRowIds, id]
      : selectedRowIds.filter((rowId) => rowId !== id);
    setConfig({ ...config, selectedRowIds: newSelectedRowIds });
  }
  function toggleSelectAll(checked: boolean) {
    const newSelectedRowIds = checked ? result?.data?.map((row) => row.__id__) ?? [] : [];
    setConfig({ ...config, selectedRowIds: newSelectedRowIds });
  }

  // Update main checkbox when selectedRowIds changes
  useEffect(() => {
    if (selectedRowIds.length === result?.data?.length) {
      setIsMainCheckChecked(true);
    } else if (selectedRowIds.length === 0) {
      setIsMainCheckChecked(false);
    } else {
      setIsMainCheckChecked(undefined);
    }
  }, [selectedRowIds]);

  // Update processedResult when result, sort, filter or pagination changes
  useMemo(() => {
    let newResult = result?.data ?? [];

    // Sort
    newResult = [...newResult].sort((a, b) => {
      // if a column is selected, sort by that column
      if (sort.sortedColumn) {
        return stringify(a[sort.sortedColumn]).localeCompare(
          stringify(b[sort.sortedColumn]),
        );
      }

      // else sort by id
      return a.__id__ - b.__id__;
    });
    if (sort.sortDirection === "desc") newResult = newResult.reverse();

    setProcessedResult(newResult);
  }, [result, sort, filter, pagination]);

  return (
    <div className="overflow-hidden rounded border-2 border-border">
      <table className="w-full">
        <thead className="bg-primary">
          <tr className="border-b-2 border-border">
            <th className="w-9 px-2">
              <Checkbox checked={isMainCheckChecked} onChange={toggleSelectAll} />
            </th>

            {selectedColumns.map((column, index) => (
              <th key={index} className="border-s border-border p-0">
                <button
                  className="flex w-full items-center justify-between px-2 text-start hover:bg-secondaryAccent active:bg-secondaryActive"
                  onClick={() => toggleSort(column)}
                >
                  {column}
                  <BsCaretDownFill
                    className={
                      (sort.sortDirection === "asc" ? "rotate-180 " : " ") +
                      (sort.sortedColumn !== column ? "hidden" : "")
                    }
                  />
                </button>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {processedResult.map((row) => (
            <tr
              key={row.__id__}
              className="border-t border-border hover:bg-secondaryAccent"
            >
              <td className="px-2">
                <Checkbox
                  checked={selectedRowIds.includes(row.__id__)}
                  onChange={(checked) => {
                    console.log(row);
                    toggleSelect(checked, row.__id__);
                  }}
                />
              </td>

              {selectedColumns.map((column, index) => (
                <td key={index} className="border-s border-border px-2">
                  {stringify(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
