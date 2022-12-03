import { ColumnDefinition } from "../../Config/default";

import Checkbox from "../Checkbox";
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
      {isOpen && (
        <div className="container grid grid-cols-[auto_1fr] py-1 gap-1">
          <span className="mr-2">Selected: </span>
          <Checkbox
            checked={filter.__selected__ === "true"}
            onChange={() => onFilterChange("__selected__", filter.__selected__ !== "true" ? "true" : "")}
          />
          {columns.map((column) => {
            return (
              <>
                <span className="mr-2">{column.title}:</span>
                <Input
                  value={filter[column.key]}
                  onChange={(filterString: string) => onFilterChange(column.key, filterString)}
                />
              </>
            );
          })}
        </div>
      )}
    </>
  );
}