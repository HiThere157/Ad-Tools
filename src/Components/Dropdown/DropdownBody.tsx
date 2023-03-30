import Button from "../Button";

import { BsCheckLg } from "react-icons/bs";

type DropdownBodyProps = {
  items: string[];
  values?: string[];
  onSelection: (value: string) => any;
};
export default function DropdownBody({ items, values, onSelection }: DropdownBodyProps) {
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
              {values &&
                (values.includes(item) ? (
                  <BsCheckLg className="m-0 text-sm text-elAccentBg" />
                ) : (
                  <div className="w-3.5" />
                ))}

              <span className="flex-grow text-center">{item}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
