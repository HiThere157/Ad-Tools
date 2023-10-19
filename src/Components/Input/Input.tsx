import { twMerge } from "tailwind-merge";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
};
export default function Input({
  value,
  onChange,
  onEnter,
  placeholder,
  autoFocus,
  className,
  disabled,
}: InputProps) {
  return (
    <input
      className={twMerge(
        "rounded border-2 px-2 disabled:opacity-50",
        "border-border bg-dark focus-within:border-borderActive focus-within:bg-secondaryActive hover:border-borderAccent hover:bg-secondaryAccent",
        className,
      )}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onEnter?.();
      }}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
}
