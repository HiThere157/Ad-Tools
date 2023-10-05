export function firsObjectToPSDataSet(dataSet: Loadable<PSDataSet>): Loadable<PSDataSet> {
  if (dataSet === null) return dataSet;

  const { result, error } = dataSet;

  if (result?.data.length != 1 || error !== undefined) {
    return dataSet;
  }

  const entries = Object.entries(result.data[0]);

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
