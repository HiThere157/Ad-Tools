export const adQuery: AdQuery = {
  filter: {
    name: "",
  },
  servers: [""],
};

export const tableFilter: TableFilter = {
  column: "",
  value: "",
  operator: "is",
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
  pageSize: 50,
  pageIndex: 0,
};
