import { makeAPICall } from "./makeAPICall";

export default async function authenticateAzure(tenant: string) {
  const connected = await makeAPICall({
    command: "Get-AzureADCurrentSessionInfo",
    useStaticSession: true,
    json: false
  });

  if (connected) return true;

  return await makeAPICall({
    command: "Connect-AzureAD",
    args: {
      Tenant: tenant
    },
    useStaticSession: true
  });
}