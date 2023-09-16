import { stringify } from "../../Helper/string";
import Checkbox from "../Checkbox";

type TableElementProps = {
  data: Loadable<PSResult>;
  columns: string[];
};
export default function TableElement({ data, columns }: TableElementProps) {
  return (
    <div className="overflow-hidden rounded border-2 border-border">
      <table className="w-full">
        <thead className="bg-primary">
          <tr className="border-b-2 border-border">
            <th className="px-2">
              <Checkbox checked={false} onChange={() => {}} />
            </th>

            {columns.map((column, index) => (
              <th key={index} className="border-s border-border">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.result?.map((row) => (
            <tr key={row.__id__}>
              <td className="px-2">
                <Checkbox checked={false} onChange={() => {}} />
              </td>

              {columns.map((column, index) => (
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
