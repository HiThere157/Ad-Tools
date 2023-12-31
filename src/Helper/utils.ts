export function shouldSearchQuery(query: Query) {
  const { filters, servers } = query;
  const hasNonNameField = filters.some(({ property }) => property !== "Name");
  const hasMultipleServers = servers.length > 1;
  const hasWildcard = filters.some(({ value }) => value?.includes("*"));

  return hasNonNameField || hasMultipleServers || hasWildcard;
}

export function formatAdFilter(filters: QueryFilter[]) {
  return filters
    .map(({ property, value }) => {
      return `${property} -${value?.includes("*") ? "like" : "eq"} '${value}'`;
    })
    .join(" -and ");
}

export function mergeResponses(responses: ResultDataSet[]): ResultDataSet {
  const mergedData = responses
    .reduce((acc, response) => [...acc, ...(response?.result?.data ?? [])], [] as ResultObject[])
    .map((result, index) => {
      return { ...result, __id__: index };
    });

  const mergedColumns =
    responses.filter((response) => response?.result?.columns !== undefined)[0]?.result?.columns ??
    [];

  const mergedError = responses
    .map((response) => response?.error)
    .filter((error) => error !== undefined);
  const mergedExecutionTime = Math.max(
    ...responses.map((response) => response?.executionTime ?? 0),
  );
  const mergedTimestamp = Math.max(...responses.map((response) => response?.timestamp ?? 0));

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
