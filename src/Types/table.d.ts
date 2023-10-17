type TableConfig = {
  isFilterOpen: boolean;
  isHighlightOpen: boolean;
  isCollapsed: boolean;
  filters: TableFilter[];
  hiddenColumns: string[];
  sort: SortConfig;
  selected: number[];
  pageIndex: number;
};

type TablePreferences = {
  pageSize: number;
  highlights: TableHighlight[];
  savedFilters: SavedTableFilter[];
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

type SavedTableFilter = {
  name: string;
  filters: TableFilter[];
};

type ResultCount = {
  total: number;
  filtered: number;
  selected: number;
};
