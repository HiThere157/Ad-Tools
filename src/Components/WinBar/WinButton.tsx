type WinButtonProps = {
  children?: React.ReactNode;
  onClick: () => any;
};
export default function WinButton({ children, onClick }: WinButtonProps) {
  return (
    <button
      tabIndex={-1}
      className="px-3 py-2 outline-none dark:bg-elBg dark:enabled:hover:bg-elAccentBg dark:enabled:active:bg-elActiveBg"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
