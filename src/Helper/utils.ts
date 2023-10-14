// Get the state of a page from a redux state
/* 
  Example:

  const state = {
    activeTab: {
      users: 0,
      groups: 1,
    };
    tabs: {
      users: [
        { id: 0, title: "KOCHDA7" },
      ],
      groups: [
        { id: 1, title: "IT_Admins" },
        { id: 2, title: "OT_Users" },
      ],
    };
  }

  getPageState(state, "users") => {
    activeTab: 0,
    tabs: [
      { id: 0, title: "KOCHDA7" },
    ],
  }

  -- glhf with the types --
*/
export function getPageState<T extends Record<string, PartialRecord<string, any>>>(
  state: T,
  page: string,
) {
  return Object.fromEntries(Object.entries(state).map(([key, value]) => [key, value[page]])) as {
    [K in keyof T]?: T[K] extends PartialRecord<string, infer U> ? U : T[K];
  };
}

// Get the state of a tab from a redux state
/*
  Example:

  const state = {
    query: {
      users: {
        0: {
          isAdvanced: false,
          filter: { Name: "KOCHDA7" },
          servers: ["server1"],
        },
      },
      groups: {
        1: {
          isAdvanced: false,
          filter: { Name: "IT_Admins" },
          servers: ["server1"],
        },
        2: {
          isAdvanced: false,
          filter: { Name: "OT_Users" },
          servers: ["server1, server2"],
        },
      },
    },
  }

  getTabState(state, "groups", 1) => {
    isAdvanced: false,
    filter: { Name: "IT_Admins" },
    servers: ["server1"],
  }

  -- glhf with the types --
*/
export function getTabState<
  T extends Record<string, PartialRecord<string, PartialRecord<number, any>>>,
>(state: T, page: string, tabId: number) {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => [key, value[page]?.[tabId]]),
  ) as {
    [K in keyof T]?: T[K] extends PartialRecord<string, infer U>
      ? U extends PartialRecord<number, infer V>
        ? V
        : U
      : T[K];
  };
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
