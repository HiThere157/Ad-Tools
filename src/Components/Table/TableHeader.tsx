import { FiChevronRight, FiChevronDown } from "react-icons/fi";

type TableHeaderProps = {
  title: string;
  count: {
    total: number;
    selected: number;
    filtered: number;
  };
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};
export default function TableHeader({
  title,
  count,
  isCollapsed,
  setIsCollapsed,
}: TableHeaderProps) {
  return (
    <div className="flex items-baseline gap-2">
      <button
        className="flex items-center gap-1 text-2xl"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>{isCollapsed ? <FiChevronRight /> : <FiChevronDown />}</span>

        <h2 className="font-bold">{title}</h2>
      </button>

      <div className="flex items-center gap-1 text-grey">
        <span>
          {count.total} {count.total === 1 ? "Result" : "Results"}
        </span>

        {(count.filtered !== 0 || count.selected !== 0) && (
          <span>
            ({count.selected !== 0 && `${count.selected} Selected`}
            {count.selected !== 0 && count.filtered !== 0 && ", "}
            {count.filtered !== 0 && `${count.filtered} Filtered`})
          </span>
        )}
      </div>
    </div>
  );
}
