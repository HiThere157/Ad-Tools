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
      {isOpen ? (
        <div className="container">
          <div className="mb-1">
            <span className="mr-2">Selected: </span>
            <Checkbox
              checked={filter.__selected__ === "true"}
              onChange={() => {
                onFilterChange("__selected__", filter.__selected__ !== "true" ? "true" : "")
              }}
            />
          </div>
          {columns.map((column) => {
            return (
              <div className="mb-1 flex justify-between" key={column.key}>
                <span className="mr-2">{column.title}:</span>
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