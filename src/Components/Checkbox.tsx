import { useEffect, useRef } from "react";

import { BsCheckLg, BsDashLg } from "react-icons/bs"

type CheckboxProps = {
  classOverride?: string,
  checked: boolean | undefined,
  disabled?: boolean,
  onChange: Function
}
export default function Checkbox({
  classOverride = "",
  checked,
  disabled = false,
  onChange,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = checked === undefined
    }
  }, [checked])

  return (
    <label className={
      "control flex items-center h-5 w-5 p-1 dark:bg-primaryControl dark:border-primaryBorder " +
      "dark:hover:bg-secondaryControlAccent dark:hover:border-secondaryBorderAccent " +
      "dark:active:bg-secondaryControlActive dark:active:border-secondaryBorderActive " +
      "dark:text-primaryControlAccent " +
      classOverride
    }>
      {checked ? <BsCheckLg className="m-0 scale-150" /> : ""}
      {checked === undefined ? <BsDashLg className="m-0 scale-150" /> : ""}
      <input
        ref={ref}
        type="checkbox"
        className="appearance-none"
        checked={checked ?? false}
        onChange={() => { onChange() }}
        disabled={disabled}
      />
    </label>

  );
}
