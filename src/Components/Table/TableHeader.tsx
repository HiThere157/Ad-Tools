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
    <div className="flex">
      <button tabIndex={-1} className="mt-1 text-2xl" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FiChevronDown className={isCollapsed ? "rotate-180" : ""} />
      </button>

      <div className="flex items-baseline gap-1">
        <button
          className="rounded px-1 outline-none outline-offset-0 focus-visible:outline-borderActive"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h2 className="text-2xl font-bold" style={{ scrollMarginTop: "60px" }}>
            {title}
          </h2>
        </button>

        {count && (
          <>
            <span className="text-grey">
              {total} {total === 1 ? "Row" : "Rows"}
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
