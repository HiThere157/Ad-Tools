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
  return (
    <div>
      <label className="flex items-center gap-1">
        <span>Page size</span>
        <Dropdown
          type="single"
          items={[10, 20, 50, 100].map((size) => size.toString())}
          value={pagination.pageSize.toString()}
          onChange={(value) =>
            setPagination({ ...pagination, pageSize: parseInt(value) })
          }
        />
      </label>

      <span className="mx-2">
        {(pagination.page - 1) * pagination.pageSize} -{" "}
        {pagination.page * pagination.pageSize} of {total}
      </span>

      <Button
        theme="primary"
        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
        disabled={pagination.page == 1}
      >
        <FiChevronsLeft />
      </Button>
      <Button
        theme="primary"
        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        disabled={pagination.page >= Math.ceil(total / pagination.pageSize)}
      >
        <FiChevronsRight />
      </Button>
    </div>
  );
}
