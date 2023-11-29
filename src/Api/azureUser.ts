import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";
import { getFilterValue, removeDuplicates } from "../Helper/utils";

type SingleAzureUserResponse = {
  attributes: Loadable<PSDataSet>;
};
export async function getSingleAzureUser(query: Query): Promise<SingleAzureUserResponse> {
  const { filters } = query;
  const identity = getFilterValue(filters, "Name");

  const attributes = await invokePSCommand({
    useGlobalSession: true,
    command: `Get-AzureADUser \
    -ObjectId ${identity}`,
  });

  return {
    attributes: extractFirstObject(attributes),
  };
}

type SingleAzureUserInfoResponse = {
  memberof: Loadable<PSDataSet>;
  devices: Loadable<PSDataSet>;
};
export async function getSingleAzureInfoUser(query: Query): Promise<SingleAzureUserInfoResponse> {
  const { filters } = query;
  const identity = getFilterValue(filters, "Name");

  const [memberof, devices] = await Promise.all([
    invokePSCommand({
      useGlobalSession: true,
      command: `Get-AzureADUserMembership \
      -ObjectId ${identity} \
      -All $true`,
      selectFields: ["DisplayName", "Description"],
    }),
    invokePSCommand({
      useGlobalSession: true,
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
    useGlobalSession: true,
    command: `Get-AzureADUser \
    -SearchString ${getFilterValue(filters, "Name")} \
    -All $true`,
    selectFields,
  });

  return {
    users,
  };
}
