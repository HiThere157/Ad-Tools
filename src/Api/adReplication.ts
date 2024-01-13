import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

export function getAdReplication(
  identity: string,
  server: string,
  replicationFields: string[] = [],
) {
  const attributes = invokePSCommand({
    command: remoteIndent(`Get-ADReplicationAttributeMetadata
    (Get-AdObject -Filter "Name -eq '${identity}'" -Server ${server}).ObjectGUID
    -Server (Get-AdDomainController -DomainName ${server} -Discover -Service PrimaryDC).HostName[0]`),
    selectFields: replicationFields,
  });

  return {
    attributes: attributes.then(extractFirstObject),
  };
}
