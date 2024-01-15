import { invokePSCommand } from "../Helper/api";
import { removeIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

export async function getAzureGroupId(displayName: string): Promise<string | undefined> {
  const groups = await invokePSCommand({
    command: `Get-AzureADGroup -SearchString "${displayName}"`,
    selectFields: ["DisplayName", "ObjectId"],
  });

  const firstDisplayName = groups?.data?.[0]?.DisplayName;
  const firstObjectId = groups?.data?.[0]?.ObjectId;

  return firstDisplayName === displayName ? firstObjectId : undefined;
}

export function getAzureGroup(objectId: string, membersFields: string[] = []) {
  const attributes = invokePSCommand({
    command: `Get-AzureADGroup -ObjectId "${objectId}"`,
  });
  const members = invokePSCommand({
    command: removeIndent(`Get-AzureADGroupMember
      -ObjectId "${objectId}"
      -All $true`),
    selectFields: membersFields,
  });

  return {
    attributes: attributes.then(extractFirstObject),
    members,
  };
}

export function searchAzureGroups(searchString: string, searchFields: string[] = []) {
  const search = invokePSCommand({
    command: removeIndent(`Get-AzureADGroup
    -SearchString "${searchString}"
    -All $true`),
    selectFields: searchFields,
  });

  return {
    search,
  };
}
