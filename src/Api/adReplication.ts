import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleReplicationResponse = {
  attributes: Loadable<PSDataSet>;
};
export async function getSingleAdReplication(
  identity: string,
  server: string,
): Promise<SingleReplicationResponse> {
  const attributes = await invokePSCommand({
    command: `Get-ADReplicationAttributeMetadata \
    (Get-AdObject -Filter "Name -eq '${identity}'" -Server ${server}) \
    -Server (Get-AdDomainController -DomainName ${server} -Discover -Service PrimaryDC).HostName`,
  });

  return {
    attributes: extractFirstObject(attributes),
  };
}

type MultipleReplicationssResponse = {
  objects: Loadable<PSDataSet>;
};
export async function getMultipleAdReplications(
  filters: QueryFilter[],
  servers: string[],
): Promise<MultipleReplicationssResponse> {
  const selectFields = removeDuplicates(
    ["Name", "DisplayName"],
    filters.map(({ property }) => property),
  );

  const objects = await Promise.all(
    servers.map((server) =>
      invokePSCommand({
        command: `Get-Object \
        -Filter "${formatAdFilter(filters)}" \
        -Server ${server} \
        -Properties ${selectFields.join(",")}`,
        selectFields,
      }).then((response) => addServerToResponse(response, server, true)),
    ),
  );

  return {
    objects: mergeResponses(objects),
  };
}
