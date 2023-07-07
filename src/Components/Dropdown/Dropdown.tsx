import { useRef, useState } from "react";

import { useClickAway } from "../../Hooks/useClickAway";

import Button from "../Button";

import { BsCaretDownFill } from "react-icons/bs";

type DropdownProps = {
  items: string[];
  value: string;
  onChange: (value: string) => void;
};
export default function Dropdown({ items, value, onChange }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useClickAway(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative z-[10] w-fit">
      <Button
        theme="secondary"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <BsCaretDownFill className={isOpen ? "rotate-180" : ""} />
      </Button>

      <div
        className={
          "absolute mt-0.5 w-full overflow-hidden rounded border-2 border-border bg-primary " +
          (!isOpen ? "hidden" : "")
        }
      >
        {items.map((item, index) => (
          <button
            key={index}
            className="w-full bg-secondary hover:bg-secondaryAccent active:bg-secondaryActive"
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
