import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useClickAway } from "../Hooks/useClickAway";

import Button from "./Button";

import { BsCaretDownFill, BsCheckLg } from "react-icons/bs";

type DropdownProps = {
  children?: React.ReactNode;
  items: string[];
  value: string | string[];
  onChange?: (value: string) => void;
  onChangeMulti?: (value: string[]) => void;
  replacer?: (text: string) => string;
  className?: string;
  disabled?: boolean;
};
export default function Dropdown({
  children,
  items,
  value,
  onChange,
  onChangeMulti,
  replacer,
  className,
  disabled,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useClickAway(ref, () => setIsOpen(false));

  const getButtonLabel = (value: string | string[]) => {
    // If value is an array, we join the values with a comma
    if (typeof value !== "string") {
      return value
        .map((value) => {
          return replacer?.(value) ?? value;
        })
        .join(", ");
    } else {
      // If value is a string, we return the value
      return replacer?.(value) ?? value;
    }
  };

  const onItemSelect = (item: string) => {
    // If value is an array, we handle it as a multi-select dropdown
    if (typeof value !== "string") {
      if (value.includes(item)) {
        // Value already includes item, so we remove it
        onChangeMulti?.(value.filter((value) => value !== item));
      } else {
        // Value does not include item, so we add it
        onChangeMulti?.([...value, item]);
      }
    } else {
      // If value is a string, we handle it as a single-select dropdown
      onChange?.(item);
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <Button
        className={twMerge("flex min-h-[1.75rem] items-center gap-2", className)}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {/* If children is defined, use that, otherwise use the current value and a caret */}
        {children ? (
          children
        ) : (
          <>
            <span className="min-w-[0.5rem] flex-grow text-start">{getButtonLabel(value)}</span>
            <BsCaretDownFill className={isOpen ? "rotate-180" : ""} />
          </>
        )}
      </Button>

      <div
        className={
          "absolute left-0 z-10 mt-0.5 w-fit overflow-hidden rounded border-2 border-border bg-primary drop-shadow-custom " +
          (!isOpen ? "hidden" : "")
        }
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={
              "flex w-full items-center gap-2 whitespace-nowrap border-border bg-secondary px-2 hover:bg-secondaryAccent active:bg-secondaryActive " +
              (index !== 0 ? "border-t" : "")
            }
            onClick={() => onItemSelect(item)}
          >
            {/* If value is an array, we check if the value includes the item to show a checkmark */}
            {typeof value !== "string" &&
              (value.includes(item) ? (
                <BsCheckLg className="scale-125 text-primaryAccent" />
              ) : (
                <div className="w-4" />
              ))}

            <span>{replacer?.(item) ?? item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
