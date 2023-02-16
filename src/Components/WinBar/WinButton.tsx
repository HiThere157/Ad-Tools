type WinButtonProps = {
  children?: React.ReactNode;
  classList?: string;
  onClick: () => any;
};
export default function WinButton({ children, classList = "", onClick }: WinButtonProps) {
  return (
    <button
      tabIndex={-1}
      className={
        "px-3 py-2 outline-none dark:bg-elBg dark:enabled:hover:bg-elAccentBg dark:enabled:active:bg-elActiveBg " +
        classList
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
