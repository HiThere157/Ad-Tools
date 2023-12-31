import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";

type SingleAzureUserResponse = {
  attributes: ResultDataSet;
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
  memberof: Promise<ResultDataSet>;
  devices: Promise<ResultDataSet>;
};
export function getSingleAzureUserDetails(objectId: string): SingleAzureUserDetailsResponse {
  const memberof = invokePSCommand({
    command: `Get-AzureADUserMembership \
      -ObjectId "${objectId}" \
      -All $true`,
    selectFields: ["DisplayName", "Description"],
  });
  const devices = invokePSCommand({
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
  });

  return {
    memberof,
    devices,
  };
}

type MultipleAzureUsersResponse = {
  users: Promise<ResultDataSet>;
};
export function getMultipleAzureUsers(searchString: string): MultipleAzureUsersResponse {
  const users = invokePSCommand({
    command: `Get-AzureADUser \
    -SearchString "${searchString}" \
    -All $true`,
    selectFields: ["UserPrincipalName", "DisplayName", "Department"],
  });

  return {
    users,
  };
}
