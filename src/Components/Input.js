export default function Input({
  label = "",
  value = "",
  disabled = false,
  onChange,
  onEnter = () => {},
}) {
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  return (
    <div className="flex">
      {label ? <span className={"mr-2 whitespace-nowrap"}>{label}</span> : ""}
      <input
        className="
          control dark:bg-secondaryBg dark:border-primaryBorder
          dark:enabled:hover:border-secondaryBorderAccent 
          dark:enabled:focus-within:border-secondaryBorderAccent
        "
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
    </div>
  );
}
