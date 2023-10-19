import { twMerge } from "tailwind-merge";

import { BsX } from "react-icons/bs";

type MultiInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};
export default function MultiInput({
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: MultiInputProps) {
  const addItem = (item: string) => {
    if (item === "") return;
    onChange([...value, item]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div
      className={twMerge(
        "group rounded border-2 disabled:opacity-50",
        "border-border bg-dark focus-within:!border-borderActive hover:border-borderAccent",
        className,
      )}
    >
      <div className="flex flex-wrap">
        {value.map((item, itemIndex) => (
          <div key={itemIndex} className="relative m-0.5 rounded-full bg-secondary px-2 pe-7">
            <span>{item}</span>
            <button
              className="absolute right-1 top-1/2 translate-y-[-50%] rounded-full text-lg outline-none outline-offset-0 hover:bg-secondaryActive focus-visible:outline-borderActive active:bg-primary"
              onClick={() => removeItem(itemIndex)}
            >
              <BsX />
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        className="w-full rounded bg-dark px-2 outline-none focus:bg-secondaryAccent group-hover:bg-secondaryAccent"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addItem(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
