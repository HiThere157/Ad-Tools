export function firsObjectToPSDataSet(dataSet: Loadable<PSDataSet>): Loadable<PSDataSet> {
  if (!dataSet) return dataSet;

  const { result, error } = dataSet;

  if (result?.data.length != 1 || error !== undefined) {
    return dataSet;
  }

  const firstObject: { PropertyNames?: string[] } & PSResult = result.data[0];

  // If the first object has a PropertyNames property, use that as the columns
  const keys = firstObject.PropertyNames ?? Object.keys(firstObject);

  return {
    ...dataSet,
    result: {
      data: keys.map((key, index) => {
        return { __id__: index, key, value: firstObject[key] };
      }),
      columns: ["key", "value"],
    },
    error,
  };
}

export function addServerToResult(
  dataSet: Loadable<PSDataSet>,
  server: string,
): Loadable<PSDataSet> {
  if (!dataSet) return dataSet;

  const { result, error } = dataSet;

  if (!result || error !== undefined) {
    return dataSet;
  }

  return {
    ...dataSet,
    result: {
      data: result.data.map((row) => ({ ...row, _Server: server })),
      columns: ["_Server", ...result.columns],
    },
  };
}
