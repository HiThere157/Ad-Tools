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
  const hasNonNameField = Object.keys(filter).some((key) => key !== "name");
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
