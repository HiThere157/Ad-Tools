export function firsObjectToPSDataSet(dataSet: Loadable<PSDataSet>): Loadable<PSDataSet> {
  if (dataSet === null) return dataSet;

  const { result, error } = dataSet;

  if (result?.data.length != 1 || error !== undefined) {
    return dataSet;
  }

  const firstObject: { PropertyNames?: string[] } & PSResult = result.data[0];

  // If the first object has a PropertyNames property, use that as the columns
  const entries = firstObject?.PropertyNames ?? Object.entries(firstObject);

  return {
    ...dataSet,
    result: {
      data: entries.map(([key, value], index) => {
        return { __id__: index, key, value };
      }),
      columns: ["key", "value"],
    },
    error,
  };
}
