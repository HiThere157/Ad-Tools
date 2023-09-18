import Button from "../Button";

import {
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from "react-icons/bs";
import Dropdown from "../Dropdown";

type TablePaginationProps = {
  count: number;
  pagination: PaginationConfig;
  setPagination: (pagination: PaginationConfig) => void;
};
export default function TablePagination({
  count,
  pagination,
  setPagination,
}: TablePaginationProps) {
  const { page, size } = pagination;
  const maxPage = Math.ceil(count / size) - 1;

  const className = "bg-dark h-6 px-0.5";

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => setPagination({ ...pagination, page: 0 })}
        disabled={page <= 0}
        className={className}
      >
        <BsChevronDoubleLeft />
      </Button>
      <Button
        onClick={() => setPagination({ ...pagination, page: page - 1 })}
        disabled={page <= 0}
        className={className}
      >
        <BsChevronLeft />
      </Button>

      <span className="px-2 text-sm">
        {page + 1}/{maxPage + 1}
      </span>

      <Button
        onClick={() => setPagination({ ...pagination, page: page + 1 })}
        disabled={page >= maxPage}
        className={className}
      >
        <BsChevronRight />
      </Button>
      <Button
        onClick={() => setPagination({ ...pagination, page: maxPage })}
        disabled={page >= maxPage}
        className={className}
      >
        <BsChevronDoubleRight />
      </Button>

      <Dropdown
        items={["10", "25", "100", "500"]}
        value={size.toString()}
        onChange={(sizeString) => {
          setPagination({ ...pagination, size: Number(sizeString) });
        }}
        className="h-6 min-h-[unset] bg-dark px-1"
      />
    </div>
  );
}
