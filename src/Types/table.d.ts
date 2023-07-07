type TableConfig = {
  isCollapsed: boolean;
  sort: SortConfig;
  filter: FilterConfig;
  pagination: PaginationConfig;
  selectedRowIds: string[];
  selectedColumns: string[];
};

type SortConfig = {
  sortedColumn?: string;
  sortDirection: "asc" | "desc";
};

type FilterConfig = {
  filteredColumn: string;
  filterValue: string;
}[];

type PaginationConfig = {
  page: number;
  pageSize: number;
};

type TableCount = {
  total: number;
  selected: number;
  filtered: number;
};
