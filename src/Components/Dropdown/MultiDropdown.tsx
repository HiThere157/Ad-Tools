import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useClickAway } from "../../Hooks/useClickAway";

import Button from "../Button";

import { BsCaretDownFill, BsCheckLg } from "react-icons/bs";

type MultiDropdownProps = {
  children?: React.ReactNode;
  items: string[];
  value: string[];
  onChange: (value: string[]) => void;
  replacer?: (text: string) => string;
  className?: string;
  disabled?: boolean;
};
export default function MultiDropdown({
  children,
  items,
  value,
  onChange,
  replacer,
  className,
  disabled,
}: MultiDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useClickAway(ref, () => setIsOpen(false));

  // Get the replaced and joined text for the button
  const getButtonLabel = (value: string[]) => {
    return value
      .map((value) => {
        return replacer?.(value) ?? value;
      })
      .join(", ");
  };

  const onItemToggle = (item: string) => {
    if (value.includes(item)) {
      // Value already includes item, so we remove it
      onChange(value.filter((value) => value !== item));
    } else {
      // Value does not include item, so we add it
      onChange([...value, item]);
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
          "absolute left-0 z-20 mt-0.5 w-fit overflow-hidden rounded border-2 border-border bg-primary drop-shadow-custom " +
          (!isOpen ? "hidden" : "")
        }
      >
        {items.map((item, itemIndex) => (
          <button
            key={itemIndex}
            className={
              "flex w-full items-center gap-2 whitespace-nowrap border-border bg-secondary px-2 hover:bg-secondaryAccent active:bg-secondaryActive " +
              (itemIndex !== 0 ? "border-t" : "")
            }
            onClick={() => onItemToggle(item)}
          >
            {value.includes(item) ? (
              <BsCheckLg className="scale-125 text-primaryAccent" />
            ) : (
              <div className="w-4" />
            )}

            <span>{replacer?.(item) ?? item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
