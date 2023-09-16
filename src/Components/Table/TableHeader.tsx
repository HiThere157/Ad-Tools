import { FiChevronUp } from "react-icons/fi";

type TableHeaderProps = {
  title: string;
  resultCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};
export default function TableHeader({
  title,
  resultCount,
  isCollapsed,
  setIsCollapsed,
}: TableHeaderProps) {
  return (
    <div className="m-1 flex gap-1">
      <button className="text-2xl" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FiChevronUp className={isCollapsed ? "rotate-180" : ""} />
      </button>

      <div className="flex items-baseline gap-2">
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <h2 className="text-2xl font-bold" style={{ scrollMarginTop: "60px" }}>
            {title}
          </h2>
        </button>

        <span className="text-grey">
          {resultCount} {resultCount === 1 ? "Result" : "Results"}
        </span>
      </div>
    </div>
  );
}
