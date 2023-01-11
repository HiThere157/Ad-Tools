import { makeAPICall, electronAPI } from "./makeAPICall";

type authenticateAzureParams = {
  tenant?: string;
  useCredentials: boolean;
};
export default async function authenticateAzure({
  tenant,
  useCredentials,
}: authenticateAzureParams): Promise<boolean> {
  const connected = await makeAPICall({
    command: "Get-AzureADCurrentSessionInfo",
    useStaticSession: true,
    json: false,
  });

  if (!connected.error) return false;

  await electronAPI?.authAzureAD(tenant, useCredentials);

  return true;
}
