type ButtonProps = {
  children?: React.ReactNode;
  classList?: string;
  disabled?: boolean;
  highlight?: boolean;
  theme?: "flat" | "colorOnHover" | "color" | "invisible";
  onClick: () => any;
};
export default function Button({
  children,
  classList = "",
  disabled = false,
  highlight = false,
  theme = "flat",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={
        "control border-2 " +
        (theme === "flat"
          ? "dark:bg-elBg dark:hover:bg-elFlatAccentBg dark:active:bg-elFlatActiveBg dark:border-elFlatBorder dark:hover:border-elFlatAccentBorder dark:active:border-elFlatActiveBorder "
          : " ") +
        (theme === "colorOnHover"
          ? "dark:bg-elBg dark:hover:bg-elAccentBg dark:active:bg-elActiveBg dark:border-elBg dark:hover:border-elAccentBg dark:active:border-elActiveBg "
          : " ") +
        (theme === "color"
          ? "dark:bg-elAccentBg dark:hover:bg-elActiveBg dark:active:bg-elDarkerActiveBg dark:border-elAccentBg dark:hover:border-elActiveBg dark:active:border-elDarkerActiveBg "
          : " ") +
        (theme === "invisible"
          ? "dark:bg-transparent dark:hover:bg-elFlatAccentBg dark:active:bg-elFlatActiveBg dark:border-elFlatBorder dark:hover:border-elFlatAccentBorder dark:active:border-elFlatActiveBorder "
          : " ") +
        // highlight styling
        (highlight ? "dark:!border-elAccentBg " : " ") +
        classList
      }
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
