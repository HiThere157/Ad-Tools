type DataSet<T> = {
  key: string;
  title: string;
  timestamp?: number;
  executionTime?: number;
  data: T;
  columns: string[];
};

type TableConfig = {
  isCollapsed: boolean;
  filters: TableFilter[];
  hiddenColumns: string[];
  sort: SortConfig;
  selected: number[];
  pagination: PaginationConfig;
};
type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};
type TableFilter = {
  column: string;
  value: string;
};
type PaginationConfig = {
  size: number;
  page: number;
};

type ResultCount = {
  total: number;
  filtered: number;
  selected: number;
};
