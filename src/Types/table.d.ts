type SetResultAction = {
  page: string;
  tabId: number;
  key: string;
  result: Loadable<PSDataSet>;
};
type SetTableConfigAction = {
  page: string;
  tabId: number;
  key: string;
  config: VolatileTableConfig;
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
  type: "fg" | "bg";
  fields: string[];
};

type ResultCount = {
  total: number;
  filtered: number;
  selected: number;
};
