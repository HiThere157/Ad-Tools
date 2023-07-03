type InputProps = {
  label?: string;
  value: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "color";
  onChange: (value: string) => any;
  onEnter?: () => any;
};
export default function Input({
  label = "",
  value,
  className = "",
  disabled = false,
  placeholder,
  type = "text",
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
          (type === "color" ? "p-0 " : "") +
          // background styling
          "bg-elFlatBg hover:bg-elFlatAccentBg active:bg-elFlatActiveBg " +
          // border styling
          "border-2 border-elFlatBorder hover:border-elFlatAccentBorder focus-within:border-elFlatActiveBorder " +
          className
        }
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
