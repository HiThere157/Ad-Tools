import { BsCaretDownFill } from "react-icons/bs";

type TableElementProps = {
  result: Loadable<PSResult>;
  config: TableConfig;
  setConfig: (config: TableConfig) => void;
  setCount: (count: TableCount) => void;
};
export default function TableElement({ result, config, setConfig }: TableElementProps) {
  const { sort, filter, pagination, selectedRowIds, selectedColumns } = config;

  return (
    <table>
      <thead className="bg-primary">
        <tr className="border-b-2 border-border">
          <th className="border-border px-2">
            <input type="checkbox" />
          </th>
          {selectedColumns.map((column, index) => (
            <th key={index}>
              <button className="px-2 hover:bg-secondaryAccent active:bg-secondaryActive">
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
    </table>
  );
}
