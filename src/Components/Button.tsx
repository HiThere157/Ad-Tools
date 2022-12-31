type ButtonProps = {
  children?: React.ReactNode;
  classOverride?: string;
  disabled?: boolean;
  highlight?: boolean;
  colorful?: boolean;
  onClick: () => any;
};
export default function Button({
  children,
  classOverride = "",
  disabled = false,
  highlight = false,
  colorful = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={
        "control " +
        // background styling
        (colorful
          ? "dark:bg-elBg dark:hover:bg-elAccentBg dark:active:bg-elActiveBg "
          : "dark:bg-elBg dark:hover:bg-elFlatAccentBg dark:active:bg-elFlatActiveBg ") +
        // border styling
        (colorful
          ? "border-0 "
          : "border-2 dark:border-elFlatBorder dark:hover:border-elFlatAccentBorder dark:active:border-elFlatActiveBorder ") +
        // highlight styling
        (highlight ? "dark:!border-elAccentBg " : " ") +
        classOverride
      }
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
