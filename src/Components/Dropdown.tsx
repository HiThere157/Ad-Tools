import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useClickAway } from "../Hooks/useClickAway";

import Button from "./Button";

import { BsCaretDownFill } from "react-icons/bs";

type DropdownProps = {
  children?: React.ReactNode;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  replacer?: (text: string) => string;
  className?: string;
};
export default function Dropdown({
  children,
  items,
  value,
  onChange,
  replacer,
  className,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useClickAway(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <Button
        className={twMerge("flex min-h-[1.75rem] items-center gap-2", className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* If children is defined, use that, otherwise use the current value and a caret */}
        {children ? (
          children
        ) : (
          <>
            <span className="min-w-[0.5rem]">{replacer?.(value) ?? value}</span>
            <BsCaretDownFill className={isOpen ? "rotate-180" : ""} />
          </>
        )}
      </Button>

      <div
        className={
          "absolute right-0 z-10 mt-0.5 w-fit overflow-hidden rounded border-2 border-border bg-primary drop-shadow-custom " +
          (!isOpen ? "hidden" : "")
        }
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={
              "w-full whitespace-nowrap border-border bg-secondary px-2 hover:bg-secondaryAccent active:bg-secondaryActive " +
              (index !== 0 ? "border-t" : "")
            }
            onClick={() => {
              onChange(item);
              setIsOpen(false);
            }}
          >
            {replacer?.(item) ?? item}
          </button>
        ))}
      </div>
    </div>
  );
}
