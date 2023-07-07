import Button from "../Button";

import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import Dropdown from "../Dropdown/Dropdown";

type PaginationProps = {
  total: number;
  pagination: PaginationConfig;
  setPagination: (pagination: PaginationConfig) => void;
};
export default function Pagination({
  total,
  pagination,
  setPagination,
}: PaginationProps) {
  function setPage(deltaPage: 1 | -1) {
    setPagination({ ...pagination, page: pagination.page + deltaPage });
  }

  function setPageSize(pageSize: number) {
    setPagination({ page: 0, pageSize });
  }

  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-1">
        <span>Page size:</span>
        <Dropdown
          items={[10, 20, 50, 100].map((size) => size.toString())}
          value={pagination.pageSize.toString()}
          onChange={(value) => setPageSize(parseInt(value))}
        />
      </label>

      <span>
        {pagination.page * pagination.pageSize} -{" "}
        {Math.min((pagination.page + 1) * pagination.pageSize, total)} of {total}
      </span>

      <Button
        theme="secondary"
        className="h-7"
        onClick={() => setPage(-1)}
        disabled={pagination.page == 0}
      >
        <FiChevronsLeft />
      </Button>
      <Button
        theme="secondary"
        className="h-7"
        onClick={() => setPage(1)}
        disabled={pagination.page == Math.ceil(total / pagination.pageSize) - 1}
      >
        <FiChevronsRight />
      </Button>
    </div>
  );
}
