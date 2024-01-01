import { invokePSCommand } from "../Helper/api";
import { addServerToResponse } from "../Helper/postProcessors";
import { formatAdFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type MultipleAdObjectsResponse = {
  objects: Promise<ResultDataSet>;
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
        command: `Get-AdObject \
        -Filter "${formatAdFilter(filters)}" \
        -Server ${server} \
        -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResponse(response, server, true)),
    ),
  );

  return {
    objects: objects.then(mergeResponses),
  };
}
