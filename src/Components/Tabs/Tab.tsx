type TabProps = {
  tab: Tab;
  isPersistent: boolean;
  isActive: boolean;
};
export default function Tab({ tab, isPersistent, isActive }: TabProps) {
  const { id, title } = tab;

  return (
    <div
      className={`mx-2 my-0.5 flex items-center gap-2 rounded px-2 py-0.5 ${
        isActive
          ? "bg-primaryAccent hover:bg-primaryActive"
          : "bg-light hover:bg-secondaryAccent active:bg-secondaryActive"
      }`}
    >
      <span>{title}</span>
      {!isPersistent && <button>x</button>}
    </div>
  );
}
