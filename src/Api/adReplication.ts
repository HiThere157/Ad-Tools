import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";

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
