type TableConfig = {
  isCollapsed: boolean;
  sort: SortConfig;
  pagination: PaginationConfig;
  selectedRowIds: string[];
  selectedColumns: string[];
};

type SortConfig = {
  sortedColumn?: string;
  sortDirection: "asc" | "desc";
};

type PaginationConfig = {
  page: number;
  pageSize: number;
};
