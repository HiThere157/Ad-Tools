import { PowerShell } from "node-powershell";

const packageJson = require("../../package.json");

export function getEnvironment(): ElectronEnvironment {
  return {
    executingUser: `${process.env.USERDOMAIN}\\${process.env.USERNAME}`,
    appVersion: "v" + packageJson.version ?? "",
    appChannel: process.env.AD_TOOLS_PRERELEASE === "true" ? "beta" : "stable",
  };
}

export async function getDnsSuffixList(): Promise<string[]> {
  const session = new PowerShell();

  try {
    const output = await session.invoke(
      "(Get-DnsClientGlobalSetting).SuffixSearchList | ConvertTo-Json -Compress",
    );
    return JSON.parse(output.raw || "[]");
  } finally {
    session.dispose();
  }
}
