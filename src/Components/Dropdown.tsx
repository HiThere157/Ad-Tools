import { useState, useRef, useEffect } from "react";

import Button from "./Button";

import { BsCaretDownFill } from "react-icons/bs";

type DropdownProps = {
  items: string[];
  value: string | undefined;
  disabled?: boolean;
  onChange: (value: string) => any;
};
export default function Dropdown({
  items,
  value,
  disabled = false,
  onChange,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (ref.current && !ref.current.contains(target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const changeSelectedItem = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="w-max z-10">
      <Button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        <div className="flex items-center h-6">
          {value}
          <BsCaretDownFill
            className={"ml-2 text-base " + (isOpen ? "rotate-180" : "")}
          />
        </div>
      </Button>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <DropdownBody items={items} onSelection={changeSelectedItem} />
      </div>
    </div>
  );
}

type DropdownBodyProps = {
  items: string[];
  onSelection: (value: string) => any;
};
function DropdownBody({ items, onSelection }: DropdownBodyProps) {
  return (
    <div className="absolute flex flex-col min-w-full rounded overflow-hidden mt-1">
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            classOverride={"rounded-none " + (index !== 0 ? "border-t-0" : "")}
            onClick={() => onSelection(item)}
          >
            {item}
          </Button>
        );
      })}
    </div>
  );
}
