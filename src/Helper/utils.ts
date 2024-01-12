export function shouldSearchQuery(query: Query) {
  const { filters, servers } = query;
  const hasNonNameField = filters.some(({ property }) => property !== "Name");
  const hasMultipleServers = servers.length > 1;
  const hasWildcard = filters.some(({ value }) => value?.includes("*"));

  return hasNonNameField || hasMultipleServers || hasWildcard;
}

export function formatAdFilter(filters: QueryFilter[]) {
  return filters
    .filter(({ value }) => value)
    .map(({ property, value }) => {
      return `${property} -${value?.includes("*") ? "like" : "eq"} '${value}'`;
    })
    .join(" -and ");
}

export function mergeDataSets(dataSets: DataSet[]): DataSet {
  const mergedData = dataSets
    .reduce((acc, dataSet) => [...acc, ...(dataSet?.result?.data ?? [])], [] as ResultObject[])
    .map((result, index) => {
      return { ...result, __id__: index };
    });

  const mergedColumns =
    dataSets.filter((dataSet) => dataSet?.result?.columns !== undefined)[0]?.result?.columns ?? [];

  const mergedError = dataSets
    .map((dataSet) => dataSet?.error)
    .filter((error) => error !== undefined);
  const mergedExecutionTime = Math.max(...dataSets.map((dataSet) => dataSet?.executionTime ?? 0));
  const mergedTimestamp = Math.max(...dataSets.map((dataSet) => dataSet?.timestamp ?? 0));

  return {
    result: {
      data: mergedData,
      columns: mergedColumns,
    },
    error: mergedError.length > 0 ? mergedError.join("; ") : undefined,
    timestamp: mergedTimestamp,
    executionTime: mergedExecutionTime,
  };
}

export function removeDuplicates<T>(...array: T[]) {
  return [...new Set(array.flat())];
}

export function getFilterValue(filters: QueryFilter[], property: string) {
  return filters.find(({ property: filterProperty }) => filterProperty === property)?.value ?? "";
}
