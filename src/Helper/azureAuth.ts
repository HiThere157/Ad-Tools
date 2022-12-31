import { makeAPICall } from "./makeAPICall";

export default async function authenticateAzure(tenant: string | undefined): Promise<boolean> {
  const connected = await makeAPICall({
    command: "Get-AzureADCurrentSessionInfo",
    useStaticSession: true,
    json: false,
  });

  if (!connected.error) return false;

  await makeAPICall({
    command: "Connect-AzureAD",
    args: tenant
      ? {
          Tenant: tenant,
        }
      : undefined,
    useStaticSession: true,
    json: false,
  });

  return true;
}
