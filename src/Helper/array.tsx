import { stringify } from "./string";

export function filterData(data: PSResult, filters: TableFilter[]) {
  return data;
}

export function sortData(data: PSResult, sort: SortConfig) {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    if (sort.direction === "desc") {
      [a, b] = [b, a];
    }

    return stringify(a[sort.column]).localeCompare(stringify(b[sort.column]));
  });

  return sortedData;
}
