import Button from "../Button";

import { BsArrowCounterclockwise, BsFunnel } from "react-icons/bs";

type TableActionsProps = {
  onReset: () => void;
  onFilterMenu: () => void;
};
export default function TableActions({ onReset, onFilterMenu }: TableActionsProps) {
  return (
    <div className="flex gap-1">
      <Button className="p-1" onClick={onReset}>
        <BsArrowCounterclockwise />
      </Button>
      <Button className="p-1" onClick={onFilterMenu}>
        <BsFunnel />
      </Button>
    </div>
  );
}
