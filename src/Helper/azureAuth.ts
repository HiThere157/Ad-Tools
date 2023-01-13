import { makeAPICall, electronAPI } from "./makeAPICall";

async function isAuthenticated(): Promise<boolean> {
  const result = await makeAPICall({
    command: "Get-AzureADCurrentSessionInfo",
    useStaticSession: true,
    json: false,
  });

  return !result.error;
}

async function azureLogin(): Promise<boolean> {
  const accountId = window.sessionStorage.getItem("conf_AzureLastUpn") ?? "";
  const useCredentials = JSON.parse(
    window.sessionStorage.getItem("conf_AzureUseCredentials") ?? "false",
  );

  const result = await electronAPI?.authAzureAD({
    accountId: accountId === "" ? undefined : accountId,
    useCredentials,
  });

  return !result?.error;
}

async function azureLogout(): Promise<boolean> {
  const result = await makeAPICall({
    command: "Disconnect-AzureAD",
    useStaticSession: true,
    json: false,
  });

  return !result.error;
}

export { isAuthenticated, azureLogin, azureLogout };
