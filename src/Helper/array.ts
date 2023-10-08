import { stringify } from "./string";

export function filterData(data: PSResult[], filters: TableFilter[]) {
  return data.filter((row) => {
    return filters.every((filter) => {
      // If the filter value is empty, we return true
      if (!filter.value) return true;

      // Get the string value of the column value
      // Transform the filter value into a regex
      const value = stringify(row[filter.column]);
      const filterValue = filter.value.replace(/\*/g, ".*");

      const regex = new RegExp(`^${filterValue}$`, "i");
      return regex.test(value);
    });
  });
}

export function sortData(data: PSResult[], sort: SortConfig) {
  const { column, direction } = sort;

  return [...data].sort((a, b) => {
    if (direction === "desc") {
      [a, b] = [b, a];
    }

    return stringify(a[column]).localeCompare(stringify(b[column]));
  });
}

export function paginateData(data: PSResult[], page: number, pageSize: number) {
  if (pageSize === -1) return data;

  return data.slice(page * pageSize, (page + 1) * pageSize);
}
