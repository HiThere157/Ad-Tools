export function extractFirstObject(dataSet: DataSet): DataSet {
  if (!dataSet) return dataSet;

  const { data, error } = dataSet;
  if (!data || data.length != 1 || error) return dataSet;

  const firstObject: { PropertyNames?: string[] } & ResultObject = data[0];

  // If the first object has a PropertyNames property, use that as the columns
  const keys = firstObject.PropertyNames ?? Object.keys(firstObject);

  return {
    ...dataSet,
    data: keys.map((key, index) => {
      return { __id__: index, key, value: firstObject[key] };
    }),
  };
}

export function addServerToDataSet(dataSet: DataSet, server: string): DataSet {
  if (!dataSet) return dataSet;

  const { data, error } = dataSet;
  if (!data || error) return dataSet;

  return {
    ...dataSet,
    data: data.map((row) => ({ ...row, _Server: server })),
  };
}

export function resolveASCIIArray(dataSet: DataSet, key: string): DataSet {
  if (!dataSet) return dataSet;

  const { data, error } = dataSet;
  if (!data || error) return dataSet;

  return {
    ...dataSet,
    data: data.map((row) => {
      const charCodes = row[key]?.filter((char: number) => char !== 0) as number[] | undefined;

      return {
        ...row,
        [key]: charCodes ? String.fromCharCode(...charCodes) : "null",
      };
    }),
  };
}
