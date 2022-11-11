import Button from "../Button";
import Input from "../Input";

import {
  BsFunnel,
  BsArrowCounterclockwise,
  BsClipboard,
} from "react-icons/bs";

function ActionMenu({
  onResetTable,
  onCopy,
  onFilter,
  isCopyHighlighted,
  isFilterHighlighted,
}) {
  return (
    <div className="flex flex-col space-y-1">
      <Button
        classOverride="p-2"
        onClick={onFilter}
        highlight={isFilterHighlighted}
      >
        <BsFunnel />
      </Button>
      <Button classOverride="p-2" onClick={onResetTable}>
        <BsArrowCounterclockwise />
      </Button>
      <Button
        classOverride="p-2"
        onClick={onCopy}
        highlight={isCopyHighlighted}
      >
        <BsClipboard />
      </Button>
    </div>
  );
}

function FilterMenu({ isOpen, columns, filter, onFilterChange }) {
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
                  onChange={(filterString) => {
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

export { ActionMenu, FilterMenu };
