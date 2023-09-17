import { FiChevronDown } from "react-icons/fi";

type TableHeaderProps = {
  title: string;
  count?: ResultCount;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};
export default function TableHeader({
  title,
  count,
  isCollapsed,
  setIsCollapsed,
}: TableHeaderProps) {
  const { total, selected, filtered } = count ?? {};

  return (
    <div className="flex gap-1">
      <button className="mt-1 text-2xl" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FiChevronDown className={isCollapsed ? "rotate-180" : ""} />
      </button>

      <div className="flex items-baseline gap-2">
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <h2 className="text-2xl font-bold" style={{ scrollMarginTop: "60px" }}>
            {title}
          </h2>
        </button>

        {count && (
          <>
            <span className="text-grey">
              {total} {total === 1 ? "Result" : "Results"}
            </span>

            {(selected !== 0 || filtered !== 0) && (
              <span className="text-grey">
                ({selected !== 0 && `${selected} Selected`}
                {selected !== 0 && filtered !== 0 && ", "}
                {filtered !== 0 && `${filtered} Hidden`})
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
