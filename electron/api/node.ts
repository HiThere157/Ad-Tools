import { PowerShell } from "node-powershell";

const packageJson = require("../../package.json");

export async function getEnvironment(): Promise<ElectronEnvironment> {
  const session = new PowerShell();
  const dnsSuffixListOutput = await session.invoke(
    "(Get-DnsClientGlobalSetting).SuffixSearchList | ConvertTo-Json -Compress",
  );

  const dnsSuffixList = JSON.parse(dnsSuffixListOutput.raw || "[]") as string[];

  return {
    executingUser: `${process.env.USERDOMAIN}\\${process.env.USERNAME}`,
    dnsSuffixList,
    appVersion: packageJson.version ?? ("" as string),
    appChannel: process.env.AD_TOOLS_PRERELEASE === "true" ? "beta" : "stable",
  };
}
