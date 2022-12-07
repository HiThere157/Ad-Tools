import { useEffect, useRef } from "react";

import { BsCheckLg, BsDashLg } from "react-icons/bs";

type CheckboxProps = {
  label?: string;
  classOverride?: string;
  checked: boolean | undefined;
  disabled?: boolean;
  onChange: () => any;
};
export default function Checkbox({
  label = "",
  classOverride = "",
  checked,
  disabled = false,
  onChange,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = checked === undefined;
    }
  }, [checked]);

  return (
    <div className="flex items-center">
      <label
        className={
          "control flex items-center h-5 w-5 p-1 dark:bg-primaryControl dark:border-primaryBorder " +
          "dark:hover:bg-secondaryControlAccent dark:hover:border-secondaryBorderAccent " +
          "dark:active:bg-secondaryControlActive dark:active:border-secondaryBorderActive " +
          "dark:text-primaryControlAccent " +
          (disabled ? "cursor-not-allowed" : "") +
          classOverride
        }
      >
        {checked && <BsCheckLg className="m-0 scale-150" />}
        {checked === undefined && <BsDashLg className="m-0 scale-150" />}
        <input
          ref={ref}
          type="checkbox"
          className="appearance-none"
          checked={checked ?? false}
          onChange={() => onChange()}
          disabled={disabled}
        />
      </label>
      {label && (
        <span
          className={"ml-2 whitespace-nowrap cursor-pointer"}
          onClick={() => onChange()}
        >
          {label}
        </span>
      )}
    </div>
  );
}
