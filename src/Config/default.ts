export const defaultTableConfig: TableConfig = {
  isCollapsed: false,
  sort: {
    sortDirection: "asc",
  },
  filter: [],
  pagination: {
    page: 0,
    pageSize: 50,
  },
  selectedRowIds: [],
  selectedColumns: [],
};

export const defaultTableCount: TableCount = {
  total: 0,
  selected: 0,
  filtered: 0,
};
