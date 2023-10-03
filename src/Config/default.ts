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
  isFilterOpen: false,
  isCollapsed: false,
  filters: [],
  hiddenColumns: [],
  sort: {
    column: "__id__",
    direction: "asc",
  },
  selected: [],
  pagination: {
    size: 10,
    page: 0,
  },
};
