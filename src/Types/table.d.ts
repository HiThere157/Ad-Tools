type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type TableConfig = {
  volatile: VolatileTableConfig;
  persistent: PersistentTableConfig;
};

type VolatileTableConfig = {
  isFilterOpen: boolean;
  isHighlightOpen: boolean;
  isCollapsed: boolean;
  filters: TableFilter[];
  hiddenColumns: string[];
  sort: SortConfig;
  selected: number[];
  page: number;
};
type PersistentTableConfig = {
  pageSize: number;
  highlights: TableHighlight[];
};

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

type TableFilter =
  | {
      type: "is";
      column: string;
      value: string;
    }
  | {
      type: "in";
      column: string;
      value: string[];
    };
type TableHighlight = {
  color: string;
  fields: string[];
};

type ResultCount = {
  total: number;
  filtered: number;
  selected: number;
};
