import { twMerge } from "tailwind-merge";

type HeaderButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};
export default function HeaderButton({ children, className, onClick }: HeaderButtonProps) {
  return (
    <button
      tabIndex={-1}
      className={twMerge(
        "bg-primary px-3 py-2 hover:bg-primaryAccent active:bg-primaryActive",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
