import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";
import { getFilterValue, removeDuplicates } from "../Helper/utils";

type SingleAzureGroupResponse = {
  attributes: Loadable<PSDataSet>;
  members: Loadable<PSDataSet>;
};
export async function getSingleAzureGroup(query: Query): Promise<SingleAzureGroupResponse> {
  const { filters } = query;
  const identity = getFilterValue(filters, "Name");

  const [attributes, members] = await Promise.all([
    invokePSCommand({
      command: `Get-AzureADGroup \
      -ObjectId ${identity}`,
    }),
    invokePSCommand({
      command: `Get-AzureADGroupMember \
      -ObjectId ${identity} \
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
  users: Loadable<PSDataSet>;
};
export async function getMultipleAzureGroups(query: Query): Promise<MultipleAzureGroupsResponse> {
  const { filters } = query;
  const selectFields = removeDuplicates(
    ["DisplayName", "Description"],
    filters.map(({ property }) => property),
  );

  const users = await invokePSCommand({
    command: `Get-AzureADGroup \
    -SearchString ${getFilterValue(filters, "Name")} \
    -All $true`,
    selectFields,
  });

  return {
    users,
  };
}
