import { invokePSCommand } from "../Helper/api";
import { addServerToResponse, extractFirstObject } from "../Helper/postProcessors";
import { formatAdFilter, mergeResponses, removeDuplicates } from "../Helper/utils";

type SingleReplicationResponse = {
  attributes: Promise<ResultDataSet>;
};
export function getSingleAdReplication(
  identity: string,
  server: string,
): SingleReplicationResponse {
  const attributes = invokePSCommand({
    command: `Get-ADReplicationAttributeMetadata \
    (Get-AdObject -Filter "Name -eq '${identity}'" -Server ${server}).ObjectGUID \
    -Server (Get-AdDomainController -DomainName ${server} -Discover -Service PrimaryDC).HostName[0]`,
    selectFields: ["AttributeName", "AttributeValue", "LastOriginatingChangeTime"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
  };
}

type MultipleReplicationTargetsResponse = {
  objects: Promise<ResultDataSet>;
};
export function getMultipleAdReplicationTargets(
  filters: QueryFilter[],
  servers: string[],
): MultipleReplicationTargetsResponse {
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
