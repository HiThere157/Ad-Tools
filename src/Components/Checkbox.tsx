import { useRef, useEffect } from "react";

import { BsCheckLg, BsDashLg } from "react-icons/bs";

type CheckboxProps = {
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
};
export default function Checkbox({ checked, onChange }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = checked === undefined;
    }
  }, [checked]);

  return (
    <label
      className={
        "flex h-5 w-5 items-center rounded border-2 p-1 " +
        "border-border bg-secondary text-primaryAccent hover:border-borderAccent hover:bg-secondaryAccent active:border-borderActive active:bg-secondaryActive"
      }
    >
      {checked && <BsCheckLg className="m-0 scale-150" />}
      {checked === undefined && <BsDashLg className="m-0 scale-150" />}
      <input
        ref={ref}
        type="checkbox"
        className="appearance-none"
        checked={checked ?? false}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
