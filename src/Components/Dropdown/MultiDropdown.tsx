import { useState, useRef, useEffect } from "react";

import Button from "../Button";
import DropdownBody from "./DropdownBody";

import { BsCaretDownFill } from "react-icons/bs";

type MultiDropdownProps = {
  items: string[];
  values: string[] | undefined;
  disabled?: boolean;
  onChange: (values: string[]) => any;
};
export default function Dropdown({
  items,
  values,
  disabled = false,
  onChange,
}: MultiDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    if (values?.includes(item)) {
      return onChange(values.filter((value) => value !== item));
    }

    onChange([...(values ?? []), item]);
  };

  return (
    <div ref={ref} className="w-max z-[10]">
      <Button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        <div className="flex items-center h-6">
          {values?.join(", ")}
          <BsCaretDownFill className={"ml-2 text-base " + (isOpen ? "rotate-180" : "")} />
        </div>
      </Button>
      <div className={isOpen ? "scale-100" : "scale-0"}>
        <DropdownBody items={items} values={values ?? []} onSelection={changeSelectedItem} />
      </div>
    </div>
  );
}
