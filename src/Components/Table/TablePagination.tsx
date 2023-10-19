import Button from "../Button";
import Dropdown from "../Dropdown/Dropdown";

import {
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from "react-icons/bs";

type TablePaginationProps = {
  count: number;
  pageSize: number;
  pageIndex: number;
  setPageSize: (pageSize: number) => void;
  setPageIndex: (pageIndex: number) => void;
};
export default function TablePagination({
  count,
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
}: TablePaginationProps) {
  const maxPage = Math.ceil(count / pageSize) - 1;
  const className = "bg-dark p-0.5";

  return (
    <div className="flex items-center gap-1">
      {pageSize !== -1 && (
        <>
          <Button onClick={() => setPageIndex(0)} disabled={pageIndex <= 0} className={className}>
            <BsChevronDoubleLeft />
          </Button>
          <Button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex <= 0}
            className={className}
          >
            <BsChevronLeft />
          </Button>

          <span className="px-2 text-sm">
            {pageIndex + 1}/{maxPage + 1}
          </span>

          <Button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex >= maxPage}
            className={className}
          >
            <BsChevronRight />
          </Button>
          <Button
            onClick={() => setPageIndex(maxPage)}
            disabled={pageIndex >= maxPage}
            className={className}
          >
            <BsChevronDoubleRight />
          </Button>
        </>
      )}

      <Dropdown
        items={["10", "25", "50", "250", "-1"]}
        value={pageSize.toString()}
        onChange={(sizeString) => {
          setPageSize(Number(sizeString));
        }}
        replacer={(value) => (value === "-1" ? "All" : value)}
        className="h-6 min-h-[unset] bg-dark px-1"
      />
    </div>
  );
}
