import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

type SingleReplicationResponse = {
  attributes: Promise<DataSet>;
};
export function getSingleAdReplication(
  identity: string,
  server: string,
): SingleReplicationResponse {
  const attributes = invokePSCommand({
    command: remoteIndent(`Get-ADReplicationAttributeMetadata
    (Get-AdObject -Filter "Name -eq '${identity}'" -Server ${server}).ObjectGUID
    -Server (Get-AdDomainController -DomainName ${server} -Discover -Service PrimaryDC).HostName[0]`),
    selectFields: ["LastOriginatingChangeTime", "AttributeName", "AttributeValue"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
  };
}
