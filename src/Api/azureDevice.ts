import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";

export async function getSingleAzureDeviceId(displayName: string): Promise<string | undefined> {
  const devices = await invokePSCommand({
    command: `Get-AzureADDevice \
      -SearchString "${displayName}"`,
    selectFields: ["DisplayName", "ObjectId"],
  });

  const firstDisplayName = devices?.result?.data?.[0]?.DisplayName;
  const firstObjectId = devices?.result?.data?.[0]?.ObjectId;

  return firstDisplayName === displayName ? firstObjectId : undefined;
}

type SingleAzureDeviceResponse = {
  attributes: Promise<Loadable<PSDataSet>>;
};
export function getSingleAzureDevice(objectId: string): SingleAzureDeviceResponse {
  const attributes = invokePSCommand({
    command: `Get-AzureADDevice \
      -ObjectId "${objectId}"`,
  });

  return {
    attributes: attributes.then(extractFirstObject),
  };
}

type MultipleAzureDevicesResponse = {
  devices: Promise<Loadable<PSDataSet>>;
};
export function getMultipleAzureDevices(searchString: string): MultipleAzureDevicesResponse {
  const devices = invokePSCommand({
    command: `Get-AzureADDevice \
    -SearchString "${searchString}" \
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
    devices,
  };
}
