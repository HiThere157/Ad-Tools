// reset all table "selected" and set "pagination.page" to 0
export function softResetTables(
  tableConfigs?: PartialRecord<string, TableConfig>,
  tables?: string[],
) {
  const newConfigs = { ...tableConfigs };
  const tableNames = tables ?? Object.keys(newConfigs);

  tableNames.forEach((key) => {
    const config = newConfigs[key];

    if (config) {
      config.volatile.selected = [];
      config.volatile.page = 0;
    }
  });

  return newConfigs;
}

export function expectMultipleResults(query: AdQuery) {
  const { filter, servers } = query;
  const hasNonNameField = Object.keys(filter).some((key) => key !== "Name");
  const hasMultipleServers = servers.length > 1;
  const hasWildcard = Object.values(filter).some((value) => value?.includes("*"));

  return hasNonNameField || hasMultipleServers || hasWildcard;
}

export function getPSFilterString(filter: PartialRecord<string, string>) {
  return Object.entries(filter)
    .map(([key, value]) => {
      return `${key} -${value?.includes("*") ? "like" : "eq"} '${value}'`;
    })
    .join(" -and ");
}

export function mergeResponses(responses: Loadable<PSDataSet>[]) {
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
    .filter((error) => error !== undefined)
    .join("\n");
  const mergedExecutionTime = Math.max(
    ...responses.map((response) => response?.executionTime ?? 0),
  );
  const mergedTimestamp = Math.max(...responses.map((response) => response?.timestamp ?? 0));

  return {
    result: {
      data: mergedData,
      columns: mergedColumns,
    },
    timestamp: mergedTimestamp,
    executionTime: mergedExecutionTime,
    error: mergedError,
  };
}

export function removeDuplicates<T>(...array: T[]) {
  return [...new Set(array.flat())];
}
