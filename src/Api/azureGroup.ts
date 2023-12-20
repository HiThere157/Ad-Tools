import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";

export async function getSingleAzureGroupId(displayName: string): Promise<string | undefined> {
  const groups = await invokePSCommand({
    command: `Get-AzureADGroup \
      -SearchString "${displayName}"`,
    selectFields: ["DisplayName", "ObjectId"],
  });

  const firstDisplayName = groups?.result?.data?.[0]?.DisplayName;
  const firstObjectId = groups?.result?.data?.[0]?.ObjectId;

  return firstDisplayName === displayName ? firstObjectId : undefined;
}

type SingleAzureGroupResponse = {
  attributes: Promise<Loadable<PSDataSet>>;
  members: Promise<Loadable<PSDataSet>>;
};
export function getSingleAzureGroup(objectId: string): SingleAzureGroupResponse {
  const attributes = invokePSCommand({
    command: `Get-AzureADGroup \
      -ObjectId "${objectId}"`,
  });
  const members = invokePSCommand({
    command: `Get-AzureADGroupMember \
      -ObjectId "${objectId}" \
      -All $true`,
    selectFields: ["UserPrincipalName", "DisplayName", "ObjectType"],
  });

  return {
    attributes: attributes.then(extractFirstObject),
    members,
  };
}

type MultipleAzureGroupsResponse = {
  groups: Promise<Loadable<PSDataSet>>;
};
export function getMultipleAzureGroups(searchString: string): MultipleAzureGroupsResponse {
  const groups = invokePSCommand({
    command: `Get-AzureADGroup \
    -SearchString "${searchString}" \
    -All $true`,
    selectFields: ["DisplayName", "Description"],
  });

  return {
    groups,
  };
}
