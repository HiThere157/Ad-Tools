export const defaultEnvironment: ElectronEnvironment = {
  executingUser: "",
  appVersion: "",
  appChannel: "stable",
};

export const defaultAdQuery: AdQuery = {
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
  volatile: {
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
    page: 0,
  },
  persistent: {
    pageSize: 10,
    highlights: [],
  },
};
