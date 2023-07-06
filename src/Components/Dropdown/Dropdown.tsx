import { useState } from "react";

import Button from "../Button";
import { MultipleDropdownBody, SingleDropdownBody } from "./DropdownBody";

import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

type DropdownProps =
  | {
      type: "single";
      items: string[];
      value: string;
      onChange: (value: string) => void;
    }
  | {
      type: "multiple";
      items: string[];
      value: string[];
      onChange: (values: string[]) => void;
    };
export default function Dropdown({ type, items, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative z-[10] w-fit">
      <Button
        theme="secondary"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {type === "single" ? value : value.join(", ")}
        {isOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
      </Button>

      {isOpen &&
        (type === "single" ? (
          <SingleDropdownBody items={items} onChange={onChange} />
        ) : (
          <MultipleDropdownBody items={items} values={value} onChange={onChange} />
        ))}
    </div>
  );
}
