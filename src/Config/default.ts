export const adQuery: AdQuery = {
  filter: {
    name: "",
  },
  servers: [],
};

export const tableFilter: TableFilter = {
  type: "is",
  column: "",
  value: "",
};
export const tableHighlight: TableHighlight = {
  color: "#000000",
  fields: [],
};

export const tableConfig: TableConfig = {
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
