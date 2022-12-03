type WinButtonProps = {
  children?: React.ReactNode,
  onClick: Function
}
export default function WinButton({
  children,
  onClick
}: WinButtonProps) {
  return (
    <button
      className="px-3 py-2 dark:bg-primaryControl dark:enabled:hover:bg-primaryControlAccent dark:enabled:active:bg-primaryControlActive"
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
}