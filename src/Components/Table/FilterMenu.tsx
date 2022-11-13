import { ColumnDefinition } from "../../Config/default";
import Input from "../Input";

type FilterMenuProps = {
  isOpen: boolean,
  columns: ColumnDefinition[]
  filter: { [key: string]: string }
  onFilterChange: Function
}
export default function FilterMenu({ isOpen, columns, filter, onFilterChange }: FilterMenuProps) {
  return (
    <>
      {isOpen ? (
        <div className="container">
          {columns.map((column) => {
            return (
              <div className="mb-1" key={column.key}>
                <span className="ml-2 text-base">{column.title}:</span>
                <Input
                  value={filter[column.key]}
                  onChange={(filterString: string) => {
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