type WinButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick: () => any;
};
export default function WinButton({ children, className = "", onClick }: WinButtonProps) {
  return (
    <button
      tabIndex={-1}
      className={
        "px-3 py-2 outline-none bg-elBg enabled:hover:bg-elAccentBg enabled:active:bg-elActiveBg " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
