import { invokePSCommand } from "../Helper/api";
import { removeIndent } from "../Helper/string";
import { addServerToDataSet } from "../Helper/postProcessors";
import { formatAdFilter, mergeDataSets } from "../Helper/utils";

export function searchAdObjects(
  filters: QueryFilter[],
  servers: string[],
  searchFields: string[] = [],
) {
  const search = Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: removeIndent(`Get-AdObject
        -Filter "${formatAdFilter(filters)}"
        -Server ${server}
        -Properties ${searchFields.join(",")}`),
        selectFields: searchFields,
      }).then((dataSet) => addServerToDataSet(dataSet, server)),
    ),
  );

  return {
    search: search.then(mergeDataSets),
  };
}
