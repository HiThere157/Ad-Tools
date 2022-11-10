export default function Button({
  children,
  classOverride = "",
  disabled = false,
  highlight = false,
  onClick,
}) {
  return (
    <button
      className={
        "control dark:bg-primaryControl dark:border-primaryBorder " +
        "dark:enabled:hover:bg-primaryControlAccent dark:enabled:hover:border-primaryBorderAccent " +
        "dark:enabled:active:bg-primaryControlActive dark:enabled:active:border-primaryBorderActive " +
        (highlight
          ? "dark:enabled:border-primaryBorderAccent "
          : "dark:enabled:focus-within:border-secondaryBorderAccent ") +
        classOverride
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
