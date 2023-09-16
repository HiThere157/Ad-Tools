type DataSet<T> = {
  key: string;
  title: string;
  timestamp: string;
  data: T;
  columns: string[];
};

type TableConfig = {
  isCollapsed?: boolean;
  filter?: Record<string, string | undefined>;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  pageSize?: number;
  pageIndex?: number;
};
