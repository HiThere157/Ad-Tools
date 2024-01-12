export function extractFirstObject(dataSet: DataSet): DataSet {
  if (!dataSet) return dataSet;

  const { result, error } = dataSet;
  if (result?.data.length != 1 || error !== undefined) return dataSet;

  const firstObject: { PropertyNames?: string[] } & ResultObject = result.data[0];

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

export function addServerToDataSet(
  dataSet: DataSet,
  server: string,
  addToColumns?: boolean,
): DataSet {
  if (!dataSet) return dataSet;

  const { result, error } = dataSet;
  if (!result || error !== undefined) return dataSet;

  const newColumns = addToColumns ? [...result.columns, "_Server"] : result.columns;

  return {
    ...dataSet,
    result: {
      data: result.data.map((row) => ({ ...row, _Server: server })),
      columns: newColumns,
    },
  };
}

export function resolveASCIIArray(dataSet: DataSet, key: string): DataSet {
  if (!dataSet) return dataSet;

  const { result, error } = dataSet;
  if (!result || error !== undefined) return dataSet;

  return {
    ...dataSet,
    result: {
      data: result.data.map((row) => {
        return {
          ...row,
          [key]: String.fromCharCode(...row[key].filter((char: number) => char !== 0)),
        };
      }),
      columns: result.columns,
    },
  };
}
