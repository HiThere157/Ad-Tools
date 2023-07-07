import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  theme: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};
export default function Button({
  children,
  theme,
  className,
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        "rounded border-2 px-2 disabled:opacity-50 " +
          (theme === "primary"
            ? "border-primary bg-primary hover:border-primaryAccent hover:bg-primaryAccent active:border-primaryActive active:bg-primaryActive "
            : " ") +
          (theme === "secondary"
            ? "border-border bg-secondary hover:border-borderAccent hover:bg-secondaryAccent active:border-borderActive active:bg-secondaryActive"
            : ""),
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
