export function extractFirstObject(response: Loadable<PSDataSet>): Loadable<PSDataSet> {
  if (!response) return response;

  const { result, error } = response;

  if (result?.data.length != 1 || error !== undefined) {
    return response;
  }

  const firstObject: { PropertyNames?: string[] } & PSResult = result.data[0];

  // If the first object has a PropertyNames property, use that as the columns
  const keys = firstObject.PropertyNames ?? Object.keys(firstObject);

  return {
    ...response,
    result: {
      data: keys.map((key, index) => {
        return { __id__: index, key, value: firstObject[key] };
      }),
      columns: ["key", "value"],
    },
    error,
  };
}

export function addServerToResponse(
  response: Loadable<PSDataSet>,
  server: string,
): Loadable<PSDataSet> {
  if (!response) return response;

  const { result, error } = response;

  if (!result || error !== undefined) {
    return response;
  }

  return {
    ...response,
    result: {
      data: result.data.map((row) => ({ ...row, _Server: server })),
      columns: ["_Server", ...result.columns],
    },
  };
}
