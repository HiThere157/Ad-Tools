import { useState } from "react";

import Button from "../Button";

import { BsFunnel, BsArrowCounterclockwise, BsClipboard, BsClipboardCheck } from "react-icons/bs";

type ActionMenuProps = {
  onResetTable: () => any;
  onCopy: () => any;
  onCopySelection: () => any;
  onFilter: () => any;
  isFilterHighlighted: boolean;
};
export default function ActionMenu({
  onResetTable,
  onCopy,
  onCopySelection,
  onFilter,
  isFilterHighlighted,
}: ActionMenuProps) {
  const [isCopyHighlighted, setIsCopyHighlighted] = useState<boolean>(false);
  const [isCopySelectionHighlighted, setIsCopySelectionHighlighted] = useState<boolean>(false);

  const onCopyClick = () => {
    onCopy();

    if (isCopyHighlighted) return;
    setIsCopyHighlighted(true);
    setTimeout(() => {
      setIsCopyHighlighted(false);
    }, 3000);
  };

  const onCopySelectionClick = () => {
    onCopySelection();

    if (isCopySelectionHighlighted) return;
    setIsCopySelectionHighlighted(true);
    setTimeout(() => {
      setIsCopySelectionHighlighted(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-y-1">
      <Button classOverride="p-1.5" onClick={onFilter} highlight={isFilterHighlighted}>
        <BsFunnel />
      </Button>
      <Button classOverride="p-1.5" onClick={onResetTable}>
        <BsArrowCounterclockwise />
      </Button>
      <Button classOverride="p-1.5" onClick={onCopyClick} highlight={isCopyHighlighted}>
        <BsClipboard />
      </Button>
      <Button
        classOverride="p-1.5"
        onClick={onCopySelectionClick}
        highlight={isCopySelectionHighlighted}
      >
        <BsClipboardCheck />
      </Button>
    </div>
  );
}
