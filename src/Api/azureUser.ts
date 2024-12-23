import { invokePSCommand } from "../Helper/api";
import { removeIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

export async function getAzureUser(objectId: string) {
  const attributes = await invokePSCommand({
    command: `Get-AzureADUser -ObjectId "${objectId}"`,
  });

  return {
    attributes: extractFirstObject(attributes),
  };
}

export function getAzureUserDetails(
  objectId: string,
  memberofFields: string[] = [],
  devicesFields: string[] = [],
) {
  const memberof = invokePSCommand({
    command: removeIndent(`Get-AzureADUserMembership
      -ObjectId "${objectId}"
      -All $true`),
    selectFields: memberofFields,
  });
  const devices = invokePSCommand({
    command: removeIndent(`Get-AzureADUserRegisteredDevice
      -ObjectId "${objectId}"
      -All $true`),
    selectFields: devicesFields,
  });

  return {
    memberof,
    devices,
  };
}

export function searchAzureUsers(searchString: string, searchFields: string[] = []) {
  const search = invokePSCommand({
    command: removeIndent(`Get-AzureADUser
    -SearchString "${searchString}"
    -All $true`),
    selectFields: searchFields,
  });

  return {
    search,
  };
}
