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
        "rounded border-2 px-2 outline-none disabled:opacity-50",
        "border-border bg-dark focus-within:border-borderActive focus-within:bg-secondaryActive hover:border-borderAccent hover:bg-secondaryAccent",
        className,
      )}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
