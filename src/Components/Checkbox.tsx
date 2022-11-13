import { useEffect, useRef } from "react";

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
    <input
      ref={ref}
      type="checkbox"
      className={
        "control dark:bg-primaryControl dark:border-primaryBorder " +
        "dark:enabled:hover:bg-primaryControlAccent dark:enabled:hover:border-primaryBorderAccent " +
        "dark:enabled:active:bg-primaryControlActive dark:enabled:active:border-primaryBorderActive " +
        classOverride
      }
      checked={checked ?? false}
      onChange={() => { onChange() }}
      disabled={disabled}
    />
  );
}
