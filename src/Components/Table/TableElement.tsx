import { useEffect, useState } from "react";

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
                <button className="w-full px-2 text-start hover:bg-secondaryAccent active:bg-secondaryActive">
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
                  {JSON.stringify(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
