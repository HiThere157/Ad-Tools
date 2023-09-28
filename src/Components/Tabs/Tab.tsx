import { BsX } from "react-icons/bs";

type TabProps = {
  tab: Tab;
  isActive: boolean;
  onChange: () => void;
  onRemove: () => void;
};
export default function Tab({ tab, isActive, onChange, onRemove }: TabProps) {
  const { title } = tab;

  return (
    <div className="relative">
      <button
        className={`min-w-[8rem] rounded-t py-0.5 pe-12 ps-2 text-start ${isActive ? "bg-dark" : "bg-primary hover:bg-secondaryAccent active:bg-secondaryActive"
          }`}
        onClick={() => onChange()}
        onMouseUp={(e) => {
          if (e.button === 1) {
            onRemove();
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {title}
      </button>

      <button
        className={`absolute right-1 top-1/2 translate-y-[-50%] rounded-full text-lg ${isActive
            ? "hover:bg-secondaryAccent active:bg-dark"
            : "hover:bg-secondaryActive active:bg-primary"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <BsX />
      </button>
    </div>
  );
}
