import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { addServerToDataSet } from "../Helper/postProcessors";
import { formatAdFilter, mergeDataSets, removeDuplicates } from "../Helper/utils";

type MultipleAdObjectsResponse = {
  objects: Promise<DataSet>;
};
export function getMultipleAdObjects(
  filters: QueryFilter[],
  servers: string[],
): MultipleAdObjectsResponse {
  const selectFields = removeDuplicates(
    ["Name", "DisplayName"],
    filters.map(({ property }) => property),
  );

  const objects = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: remoteIndent(`Get-AdObject
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${selectFields.join(",")}`),
        selectFields,
      }).then((dataSet) => addServerToDataSet(dataSet, server, true)),
    ),
  );

  return {
    objects: objects.then(mergeDataSets),
  };
}
