import { twMerge } from "tailwind-merge";

type InputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};
export default function Input({
  label,
  value,
  onChange,
  onEnter,
  placeholder,
  className,
  disabled,
}: InputProps) {
  return (
    <label className="flex items-center">
      {label && <div className="mr-2">{label}</div>}

      <input
        className={twMerge(
          "rounded border-2 px-2 disabled:opacity-50",
          "border-border bg-secondary focus-within:border-borderActive focus-within:bg-secondaryActive hover:border-borderAccent hover:bg-secondaryAccent",
          className,
        )}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter?.();
        }}
        placeholder={placeholder}
        disabled={disabled}
      ></input>
    </label>
  );
}
