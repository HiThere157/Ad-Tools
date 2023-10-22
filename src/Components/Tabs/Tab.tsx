import { BsPeopleFill, BsPersonFill, BsDisplay, BsSearch, BsX } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

type TabProps = {
  tab: Tab;
  isActive: boolean;
  onChange: () => void;
  onRemove: () => void;
};
export default function Tab({ tab, isActive, onChange, onRemove }: TabProps) {
  const { id, icon, title } = tab;

  const icons: Record<Required<Tab>["icon"], JSX.Element> = {
    user: <BsPersonFill className="flex-shrink-0 text-primaryAccent" />,
    group: <BsPeopleFill className="flex-shrink-0 text-primaryAccent" />,
    computer: <BsDisplay className="flex-shrink-0 text-primaryAccent" />,
    search: <BsSearch className="flex-shrink-0 text-primaryAccent" />,
    loading: (
      <ClipLoader className="flex-shrink-0" color="#208cf0" speedMultiplier={0.7} size={16} />
    ),
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", id.toString());
  };

  return (
    <div className="relative" draggable="true" onDragStart={onDragStart} data-target-tab-id={id}>
      {!isActive && <div className="absolute bottom-1 left-0 top-1 border-l border-borderAccent" />}

      <button
        className={`flex items-center gap-1.5 rounded-t py-0.5 pe-7 ps-2 outline-none outline-offset-0 focus-visible:outline-borderActive ${
          isActive ? "bg-dark" : "bg-primary hover:bg-secondaryAccent active:bg-secondaryActive"
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
        {icon && icons[icon]}

        <span className="min-w-[6rem] max-w-[12rem] overflow-hidden text-ellipsis whitespace-nowrap text-start">
          {title}
        </span>
      </button>

      <button
        className={`absolute right-1 top-1/2 translate-y-[-50%] rounded-full text-lg outline-none outline-offset-0 focus-visible:outline-borderActive ${
          isActive
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
