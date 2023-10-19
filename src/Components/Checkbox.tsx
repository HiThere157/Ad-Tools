import { useRef } from "react";

import { BsCheckLg, BsDashLg } from "react-icons/bs";

type CheckboxProps = {
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
};
export default function Checkbox({ checked, onChange }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  if (ref.current) {
    ref.current.indeterminate = checked === undefined;
  }

  return (
    <label
      className={
        "flex h-5 w-5 cursor-pointer items-center rounded border-2 p-0.5 " +
        "border-border bg-dark text-primaryAccent focus-within:!border-borderActive hover:border-borderAccent hover:bg-secondaryAccent active:border-borderActive active:bg-secondaryActive"
      }
    >
      {checked && <BsCheckLg className="scale-150" />}
      {checked === undefined && <BsDashLg className="scale-150" />}
      <input
        ref={ref}
        type="checkbox"
        className="appearance-none outline-none"
        checked={checked ?? false}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
