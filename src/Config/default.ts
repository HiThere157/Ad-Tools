export const defaultTab: Tab = {
  id: 0,
  title: "Untitled",
};

export const defaultEnvironment: ElectronEnvironment = {
  executingUser: "",
  appVersion: "",
  appChannel: "stable",
};

export const defaultAdQuery: AdQuery = {
  isAdvanced: false,
  filter: {
    Name: "",
  },
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
  fields: [],
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
};
