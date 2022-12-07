type InputProps = {
  label?: string;
  value: string;
  classOverride?: string;
  disabled?: boolean;
  onChange: Function;
  onEnter?: Function;
};
export default function Input({
  label = "",
  value,
  classOverride = "",
  disabled = false,
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
          "control dark:bg-secondaryBg dark:border-primaryBorder " +
          "dark:enabled:hover:border-secondaryBorderAccent " +
          "dark:enabled:focus-within:border-secondaryBorderAccent w-full" +
          classOverride
        }
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
    </div>
  );
}
