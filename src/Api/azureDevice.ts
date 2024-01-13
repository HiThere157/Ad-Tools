import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

export async function getAzureDeviceId(displayName: string): Promise<string | undefined> {
  const devices = await invokePSCommand({
    command: `Get-AzureADDevice -SearchString "${displayName}"`,
    selectFields: ["DisplayName", "ObjectId"],
  });

  const firstDisplayName = devices?.data?.[0]?.DisplayName;
  const firstObjectId = devices?.data?.[0]?.ObjectId;

  return firstDisplayName === displayName ? firstObjectId : undefined;
}

export function getAzureDevice(objectId: string) {
  const attributes = invokePSCommand({
    command: `Get-AzureADDevice -ObjectId "${objectId}"`,
  });

  return {
    attributes: attributes.then(extractFirstObject),
  };
}

export function searchAzureDevices(searchString: string, searchFields: string[] = []) {
  const search = invokePSCommand({
    command: remoteIndent(`Get-AzureADDevice
    -SearchString "${searchString}"
    -All $true`),
    selectFields: searchFields,
  });

  return {
    search,
  };
}
