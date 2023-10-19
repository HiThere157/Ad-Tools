import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};
export default function Button({ children, className, disabled, onClick }: ButtonProps) {
  return (
    <button
      className={twMerge(
        "rounded border-2 px-2 outline-none disabled:opacity-50",
        "border-border bg-secondary hover:border-borderAccent hover:bg-secondaryAccent focus:border-borderActive active:border-borderActive active:bg-secondaryActive",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
