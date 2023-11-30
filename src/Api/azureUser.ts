import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";
import { getFilterValue, removeDuplicates } from "../Helper/utils";

type SingleAzureUserResponse = {
  attributes: Loadable<PSDataSet>;
  memberof: Loadable<PSDataSet>;
  devices: Loadable<PSDataSet>;
};
export async function getSingleAzureUser(query: Query): Promise<SingleAzureUserResponse> {
  const { filters } = query;
  const identity = getFilterValue(filters, "Name");

  const [attributes, memberof, devices] = await Promise.all([
    invokePSCommand({
      command: `Get-AzureADUser \
      -ObjectId ${identity}`,
    }),
    invokePSCommand({
      command: `Get-AzureADUserMembership \
      -ObjectId ${identity} \
      -All $true`,
      selectFields: ["DisplayName", "Description"],
    }),
    invokePSCommand({
      command: `Get-AzureADUserRegisteredDevice \
      -ObjectId ${identity} \
      -All $true`,
      selectFields: [
        "DisplayName",
        "DeviceOSType",
        "AccountEnabled",
        "IsManaged",
        "ApproximateLastLogonTimeStamp",
      ],
    }),
  ]);

  return {
    attributes: extractFirstObject(attributes),
    memberof,
    devices,
  };
}

type MultipleAzureUsersResponse = {
  users: Loadable<PSDataSet>;
};
export async function getMultipleAzureUsers(query: Query): Promise<MultipleAzureUsersResponse> {
  const { filters } = query;
  const selectFields = removeDuplicates(
    ["UserPrincipalName", "DisplayName", "Department"],
    filters.map(({ property }) => property),
  );

  const users = await invokePSCommand({
    command: `Get-AzureADUser \
    -SearchString ${getFilterValue(filters, "Name")} \
    -All $true`,
    selectFields,
  });

  return {
    users,
  };
}
