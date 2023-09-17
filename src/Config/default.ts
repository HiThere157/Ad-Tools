export const adQuery: AdQuery = {
  filter: {
    name: "",
  },
  servers: [""],
};

export const tableFilter: TableFilter = {
  column: "",
  value: "",
};

export const tableConfig: TableConfig = {
  isCollapsed: false,
  filters: [],
  hiddenColumns: [],
  sort: {
    column: "__id__",
    direction: "asc",
  },
  selected: [],
  pagination: {
    size: 25,
    page: 0,
  },
};
