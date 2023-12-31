export function extractFirstObject(response: ResultDataSet): ResultDataSet {
  if (!response) return response;

  const { result, error } = response;

  if (result?.data.length != 1 || error !== undefined) {
    return response;
  }

  const firstObject: { PropertyNames?: string[] } & ResultObject = result.data[0];

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
  response: ResultDataSet,
  server: string,
  addToColumns?: boolean,
): ResultDataSet {
  if (!response) return response;

  const { result, error } = response;

  if (!result || error !== undefined) {
    return response;
  }

  const newColumns = addToColumns ? [...result.columns, "_Server"] : result.columns;

  return {
    ...response,
    result: {
      data: result.data.map((row) => ({ ...row, _Server: server })),
      columns: newColumns,
    },
  };
}
