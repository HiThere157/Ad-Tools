import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useClickAway } from "../../Hooks/useClickAway";

import Button from "../Button";

import { BsCaretDownFill } from "react-icons/bs";

type DropdownProps = {
  children?: React.ReactNode;
  items: string[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};
export default function Dropdown({
  children,
  items,
  value,
  onChange,
  className,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useClickAway(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative z-[10] drop-shadow-custom">
      <Button
        theme="secondary"
        className={twMerge("flex items-center gap-2", className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children ?? value}
        {!children && <BsCaretDownFill className={isOpen ? "rotate-180" : ""} />}
      </Button>

      <div
        className={
          "absolute right-0 mt-0.5 w-fit overflow-hidden rounded border-2 border-border bg-primary " +
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
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
