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
  page: number;
  setPageSize: (pageSize: number) => void;
  setPage: (page: number) => void;
};
export default function TablePagination({
  count,
  pageSize,
  page,
  setPageSize,
  setPage,
}: TablePaginationProps) {
  const maxPage = Math.ceil(count / pageSize) - 1;

  const className = "bg-dark h-6 px-0.5";

  return (
    <div className="flex items-center gap-1">
      {pageSize !== -1 && (
        <>
          <Button onClick={() => setPage(0)} disabled={page <= 0} className={className}>
            <BsChevronDoubleLeft />
          </Button>
          <Button onClick={() => setPage(page - 1)} disabled={page <= 0} className={className}>
            <BsChevronLeft />
          </Button>

          <span className="px-2 text-sm">
            {page + 1}/{maxPage + 1}
          </span>

          <Button
            onClick={() => setPage(page + 1)}
            disabled={page >= maxPage}
            className={className}
          >
            <BsChevronRight />
          </Button>
          <Button onClick={() => setPage(maxPage)} disabled={page >= maxPage} className={className}>
            <BsChevronDoubleRight />
          </Button>
        </>
      )}

      <Dropdown
        items={["10", "50", "250", "-1"]}
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
