type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
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
