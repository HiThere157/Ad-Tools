export function expectMultipleResults(query: AdQuery) {
  const { filters, servers } = query;
  const hasNonNameField = Object.keys(filters).some((key) => key !== "name");
  const hasMultipleServers = servers.length > 1;
  const hasWildcard = Object.values(filters).some(({ value }) => value?.includes("*"));

  return hasNonNameField || hasMultipleServers || hasWildcard;
}

export function getPSFilterString(filters: QueryFilter[]) {
  return filters
    .map(({ property, value }) => {
      return `${property} -${value?.includes("*") ? "like" : "eq"} '${value}'`;
    })
    .join(" -and ");
}

export function mergeResponses(responses: Loadable<PSDataSet>[]): Loadable<PSDataSet> {
  const mergedData = responses
    .reduce((acc, response) => [...acc, ...(response?.result?.data ?? [])], [] as PSResult[])
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
