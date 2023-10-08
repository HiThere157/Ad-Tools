import { stringify } from "./string";

export function filterData(data: PSResult[], filters: TableFilter[]) {
  return data.filter((row) => {
    return filters.every((filter) => {
      if (filter.value.length === 0) return true;

      const valueArray = Array.isArray(filter.value) ? filter.value : [filter.value];
      return valueArray.some((filterValue) => {
        // Get the string value of the column value
        // Transform the filter value into a regex
        const value = stringify(row[filter.column]);
        const regexValue = filterValue.replace(/\*/g, ".*");

        const regex = new RegExp(`^${regexValue}$`, "i");
        return regex.test(value);
      });
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
