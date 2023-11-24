export const defaultTab: Tab = {
  id: 0,
  title: "New Tab",
};

export const defaultQueryFilter: QueryFilter = {
  property: "",
  value: "",
};

export const defaultAdQuery: AdQuery = {
  isAdvanced: false,
  filters: [
    {
      property: "Name",
      value: "",
    },
  ],
  servers: [],
};

export const defaultTableFilter: TableFilter = {
  type: "is",
  column: "",
  value: "",
};

export const defaultTableHighlight: TableHighlight = {
  color: "#000000",
  type: "bg",
  strings: [],
};

export const defaultTableConfig: TableConfig = {
  isFilterOpen: false,
  isHighlightOpen: false,
  isCollapsed: false,
  filters: [],
  hiddenColumns: [],
  sort: {
    column: "__id__",
    direction: "asc",
  },
  selected: [],
  pageIndex: 0,
};

export const defaultTablePreferences: TablePreferences = {
  pageSize: 10,
  highlights: [],
  savedFilters: [],
  savedFilterName: undefined,
};
