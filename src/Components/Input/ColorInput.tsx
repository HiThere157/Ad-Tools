import { twMerge } from "tailwind-merge";

type ColorInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};
export default function ColorInput({ value, onChange, className, disabled }: ColorInputProps) {
  return (
    <input
      className={twMerge(
        "rounded border-2 outline-none disabled:opacity-50",
        "border-border hover:border-borderAccent focus:border-borderActive",
        className,
      )}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
