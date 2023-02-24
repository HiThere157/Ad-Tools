type InputProps = {
  label?: string;
  value: string;
  classList?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string) => any;
  onEnter?: () => any;
};
export default function Input({
  label = "",
  value,
  classList = "",
  disabled = false,
  placeholder,
  onChange,
  onEnter = () => {},
}: InputProps) {
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  return (
    <div className="flex items-center">
      {label && <span className={"mr-2 whitespace-nowrap"}>{label}</span>}
      <input
        className={
          "control w-full " +
          // background styling
          "dark:bg-elFlatBg dark:hover:bg-elFlatAccentBg dark:active:bg-elFlatActiveBg " +
          // border styling
          "border-2 dark:border-elFlatBorder dark:hover:border-elFlatAccentBorder dark:focus-within:border-elFlatActiveBorder " +
          classList
        }
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
