type DataSet<T> = {
  key: string;
  title: string;
  timestamp: number;
  executionTime: number;
  data: T;
  columns: string[];
};

type TableConfig = {
  isCollapsed: boolean;
  filters: Filter[];
  hiddenColumns: string[];
  sort: SortConfig;
  selected: number[];
  pageSize: number;
  pageIndex: number;
};
type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};
type TableFilter = {
  column: string;
  value: string;
  operator: string;
};
