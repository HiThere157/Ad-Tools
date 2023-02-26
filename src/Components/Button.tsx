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
          ? "bg-elBg hover:bg-elFlatAccentBg active:bg-elFlatActiveBg border-elFlatBorder hover:border-elFlatAccentBorder active:border-elFlatActiveBorder "
          : " ") +
        (theme === "colorOnHover"
          ? "bg-elBg hover:bg-elAccentBg active:bg-elActiveBg border-elBg hover:border-elAccentBg active:border-elActiveBg "
          : " ") +
        (theme === "color"
          ? "bg-elAccentBg hover:bg-elActiveBg active:bg-elDarkerActiveBg border-elAccentBg hover:border-elActiveBg active:border-elDarkerActiveBg "
          : " ") +
        (theme === "invisible"
          ? "bg-transparent hover:bg-elFlatAccentBg active:bg-elFlatActiveBg border-elFlatBorder hover:border-elFlatAccentBorder active:border-elFlatActiveBorder "
          : " ") +
        // highlight styling
        (highlight ? "!border-elAccentBg " : " ") +
        classList
      }
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
