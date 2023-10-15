import { BsExclamationCircle, BsPersonFill, BsSearch, BsX } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

type TabProps = {
  tab: Tab;
  isActive: boolean;
  onChange: () => void;
  onRemove: () => void;
};
export default function Tab({ tab, isActive, onChange, onRemove }: TabProps) {
  const { title } = tab;

  const icons: Record<Required<Tab>["icon"], JSX.Element> = {
    user: <BsPersonFill className="flex-shrink-0 text-primaryAccent" />,
    search: <BsSearch className="flex-shrink-0 text-primaryAccent" />,
    loading: <ClipLoader className="flex-shrink-0" color="#208cf0" speedMultiplier={0.7} size={16} />,
    error: <BsExclamationCircle className="flex-shrink-0 text-red" />,
  };

  return (
    <div className="relative">
      {!isActive && <div className="absolute bottom-1 left-0 top-1 border-l border-border" />}

      <button
        className={`flex min-w-[8rem] max-w-[15rem] items-center gap-1.5 rounded-t py-0.5 pe-7 ps-2 ${isActive ? "bg-dark" : "bg-primary hover:bg-secondaryAccent active:bg-secondaryActive"
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
        {tab.icon && icons[tab.icon]}

        <span className="text-ellipsis overflow-hidden">{title}</span>
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
