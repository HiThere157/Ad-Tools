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
  attributes: Loadable<PSDataSet>;
  members: Loadable<PSDataSet>;
};
export async function getSingleAzureGroup(objectId: string): Promise<SingleAzureGroupResponse> {
  const [attributes, members] = await Promise.all([
    invokePSCommand({
      command: `Get-AzureADGroup \
      -ObjectId "${objectId}"`,
    }),
    invokePSCommand({
      command: `Get-AzureADGroupMember \
      -ObjectId "${objectId}" \
      -All $true`,
      selectFields: ["UserPrincipalName", "DisplayName", "ObjectType"],
    }),
  ]);

  return {
    attributes: extractFirstObject(attributes),
    members,
  };
}

type MultipleAzureGroupsResponse = {
  groups: Loadable<PSDataSet>;
};
export async function getMultipleAzureGroups(
  searchString: string,
): Promise<MultipleAzureGroupsResponse> {
  const groups = await invokePSCommand({
    command: `Get-AzureADGroup \
    -SearchString "${searchString}" \
    -All $true`,
    selectFields: ["DisplayName", "Description"],
  });

  return {
    groups,
  };
}
