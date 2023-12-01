import { invokePSCommand } from "../Helper/api";
import { extractFirstObject } from "../Helper/postProcessors";

export async function getSingleAzureDeviceId(displayName: string): Promise<string | undefined> {
  const devices = await invokePSCommand({
    command: `Get-AzureADDevice \
      -SearchString ${displayName}`,
    selectFields: ["DisplayName", "ObjectId"],
  });

  const firstDisplayName = devices?.result?.data?.[0]?.DisplayName;
  const firstObjectId = devices?.result?.data?.[0]?.ObjectId;

  return firstDisplayName === displayName ? firstObjectId : undefined;
}

type SingleAzureDeviceResponse = {
  attributes: Loadable<PSDataSet>;
};
export async function getSingleAzureDevice(objectId: string): Promise<SingleAzureDeviceResponse> {
  const attributes = await invokePSCommand({
    command: `Get-AzureADDevice \
      -ObjectId ${objectId}`,
  });

  return {
    attributes: extractFirstObject(attributes),
  };
}

type MultipleAzureDevicesResponse = {
  devices: Loadable<PSDataSet>;
};
export async function getMultipleAzureDevices(
  searchString: string,
): Promise<MultipleAzureDevicesResponse> {
  const devices = await invokePSCommand({
    command: `Get-AzureADDevice \
    -SearchString ${searchString} \
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
