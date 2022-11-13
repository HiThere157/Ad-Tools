import Button from "../Button";

import { BsFunnel, BsArrowCounterclockwise, BsClipboard } from "react-icons/bs";

type ActionMenuProps = {
  onResetTable: Function,
  onCopy: Function,
  onFilter: Function,
  isCopyHighlighted: boolean,
  isFilterHighlighted: boolean,
};
export default function ActionMenu({
  onResetTable,
  onCopy,
  onFilter,
  isCopyHighlighted,
  isFilterHighlighted,
}: ActionMenuProps) {
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
