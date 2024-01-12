import { invokePSCommand } from "../Helper/api";
import { remoteIndent } from "../Helper/string";
import { extractFirstObject } from "../Helper/postProcessors";

type SingleAzureUserResponse = {
  attributes: DataSet;
};
export async function getSingleAzureUser(objectId: string): Promise<SingleAzureUserResponse> {
  const attributes = await invokePSCommand({
    command: `Get-AzureADUser -ObjectId "${objectId}"`,
  });

  return {
    attributes: extractFirstObject(attributes),
  };
}

type SingleAzureUserDetailsResponse = {
  memberof: Promise<DataSet>;
  devices: Promise<DataSet>;
};
export function getSingleAzureUserDetails(objectId: string): SingleAzureUserDetailsResponse {
  const memberof = invokePSCommand({
    command: remoteIndent(`Get-AzureADUserMembership
      -ObjectId "${objectId}"
      -All $true`),
    selectFields: ["DisplayName", "Description"],
  });
  const devices = invokePSCommand({
    command: remoteIndent(`Get-AzureADUserRegisteredDevice
      -ObjectId "${objectId}"
      -All $true`),
    selectFields: [
      "DisplayName",
      "DeviceOSType",
      "AccountEnabled",
      "IsManaged",
      "ApproximateLastLogonTimeStamp",
    ],
  });

  return {
    memberof,
    devices,
  };
}

type MultipleAzureUsersResponse = {
  users: Promise<DataSet>;
};
export function getMultipleAzureUsers(searchString: string): MultipleAzureUsersResponse {
  const users = invokePSCommand({
    command: remoteIndent(`Get-AzureADUser
    -SearchString "${searchString}"
    -All $true`),
    selectFields: ["UserPrincipalName", "DisplayName", "Department"],
  });

  return {
    users,
  };
}
