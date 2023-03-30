import { useState, useRef, useEffect } from "react";

import Button from "../Button";

import { BsCaretDownFill, BsCheckLg } from "react-icons/bs";

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

type DropdownBodyProps = {
  items: string[];
  values: string[];
  onSelection: (value: string) => any;
};
function DropdownBody({ items, values, onSelection }: DropdownBodyProps) {
  return (
    <div className="absolute flex flex-col rounded overflow-hidden mt-1">
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            className={
              "rounded-none whitespace-nowrap min-h-[1.5em] " + (index !== 0 ? "border-t-0" : "")
            }
            onClick={() => onSelection(item)}
          >
            <div className="flex items-center gap-2">
              {values.includes(item) ? (
                <BsCheckLg className="m-0 text-sm text-elAccentBg" />
              ) : (
                <div className="w-3.5" />
              )}
              <span className="flex-grow text-center">{item}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
