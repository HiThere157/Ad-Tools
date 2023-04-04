import { useEffect, useRef } from "react";

import { BsCheckLg, BsDashLg } from "react-icons/bs";

type CheckboxProps = {
  label?: string;
  className?: string;
  checked: boolean | undefined;
  disabled?: boolean;
  onChange: () => any;
};
export default function Checkbox({
  label = "",
  className = "",
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
          "control flex items-center h-5 w-5 p-1 text-elAccentBg " +
          // background styling
          "bg-elFlatBg hover:bg-elFlatAccentBg active:bg-elFlatActiveBg " +
          // border styling
          "border-2 border-elFlatBorder hover:border-elFlatAccentBorder active:border-elFlatActiveBorder " +
          (disabled ? "opacity-50 cursor-not-allowed" : "") +
          className
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
          className={
            "ml-2 whitespace-nowrap cursor-pointer " +
            (disabled ? "opacity-50 cursor-not-allowed" : "")
          }
          onClick={() => !disabled && onChange()}
        >
          {label}
        </span>
      )}
    </div>
  );
}
