import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";

type SingleAzureUserResponse = {
  attributes: Loadable<PSDataSet>;
};
export async function getSingleAzureUser(objectId: string): Promise<SingleAzureUserResponse> {
  const attributes = await invokePSCommand({
    command: `Get-AzureADUser \
      -ObjectId "${objectId}"`,
  });

  return {
    attributes: extractFirstObject(attributes),
  };
}

type SingleAzureUserDetailsResponse = {
  memberof: Loadable<PSDataSet>;
  devices: Loadable<PSDataSet>;
};
export async function getSingleAzureUserDetails(
  objectId: string,
): Promise<SingleAzureUserDetailsResponse> {
  const [memberof, devices] = await Promise.all([
    invokePSCommand({
      command: `Get-AzureADUserMembership \
      -ObjectId "${objectId}" \
      -All $true`,
      selectFields: ["DisplayName", "Description"],
    }),
    invokePSCommand({
      command: `Get-AzureADUserRegisteredDevice \
      -ObjectId "${objectId}" \
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
export async function getMultipleAzureUsers(
  searchString: string,
): Promise<MultipleAzureUsersResponse> {
  const users = await invokePSCommand({
    command: `Get-AzureADUser \
    -SearchString "${searchString}" \
    -All $true`,
    selectFields: ["UserPrincipalName", "DisplayName", "Department"],
  });

  return {
    users,
  };
}
