export const adQuery: AdQuery = {
  filter: {
    name: "",
  },
  servers: [],
};

export const tableFilter: TableFilter = {
  column: "",
  value: "",
};

export const tableConfig: TableConfig = {
  volatile: {
    isFilterOpen: false,
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
  },
};
