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
  const accountId = JSON.parse(window.localStorage.getItem("conf_azureLastUpn") ?? "");
  const useCredentials = JSON.parse(
    window.localStorage.getItem("conf_azureUseCredentials") ?? "false",
  );

  const result = await electronAPI?.authAzureAD({
    accountId: accountId === "" ? undefined : accountId,
    useCredentials,
  });

  if (!result) return false;
  return !result.error;
}

// async function azureLogout(): Promise<boolean> {
//   const result = await makeAPICall({
//     command: "Disconnect-AzureAD",
//     useStaticSession: true,
//     json: false,
//   });

//   return !result.error;
// }

export { isAuthenticated, azureLogin };
