import { useState } from "react";

import Button from "../Button";

import { BsCaretDownFill } from "react-icons/bs";

type DropdownProps = {
  items: string[];
  value: string;
  onChange: (value: string) => void;
};
export default function Dropdown({ items, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative z-[10] w-fit">
      <Button
        theme="secondary"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <BsCaretDownFill className={isOpen ? "rotate-180" : ""} />
      </Button>

      {isOpen && (
        <div className="absolute mt-0.5 w-full overflow-hidden rounded border-2 border-border bg-primary">
          {items.map((item, index) => (
            <Button
              key={index}
              theme="secondary"
              className="w-full rounded-none border-0 text-right"
              onClick={() => {
                onChange(item);
                setIsOpen(false);
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
