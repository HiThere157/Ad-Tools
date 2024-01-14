type TableState = {
  config: TableConfig;
  preferences: TablePreferences;
};

type TableConfig = {
  isFilterOpen: boolean;
  isHighlightOpen: boolean;
  isColumnsOpen: boolean;
  isCollapsed: boolean;
  filters: TableFilter[];
  sort: SortConfig;
  selected: number[];
  pageIndex: number;
};

type TablePreferences = {
  pageSize: number;
  highlights: TableHighlight[];
  savedFilters: SavedTableFilter[];
  savedFilterName?: string;
  columns: TableColumn[];
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
  strings: string[];
};

type TableColumn = {
  isHidden?: boolean;
  name: string;
  label: string;
};

type SavedTableFilter = {
  name: string;
  filters: TableFilter[];
};

type ResultCount = {
  total: number;
  filtered: number;
  selected: number;
};
