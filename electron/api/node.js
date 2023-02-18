const { PowerShell } = require("node-powershell");
const ping = require("ping");
const package = require("../package.json");

const probeConnection = async (_event, target) => {
  const result = await ping.promise.probe(target);
  return { output: result.alive };
};

const getAppVersion = async (_event) => {
  const isBeta = process.env.AD_TOOLS_PRERELEASE?.toLowerCase() === "true";
  return { output: { version: package.version, isBeta } };
};

const getModuleVersion = async (_event) => {
  const ps = new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });

  try {
    const outputAzureAD = await ps.invoke(
      "Get-Module -ListAvailable -Name AzureAD | ConvertTo-Json -Compress",
    );
    const outputAD = await ps.invoke(
      "Get-Module -ListAvailable -Name ActiveDirectory | ConvertTo-Json -Compress",
    );

    const formatVersion = ({ Version }) => {
      return `${Version.Major}.${Version.Minor}.${Version.Build}.${Version.Revision}`;
    };

    return {
      output: {
        azureAD: outputAzureAD.raw ? formatVersion(JSON.parse(outputAzureAD.raw)) : null,
        activeDirectory: outputAD.raw ? formatVersion(JSON.parse(outputAD.raw)) : null,
      },
    };
  } catch (error) {
    return { error: error.toString().split("At line:1")[0] };
  }
};

module.exports = { probeConnection, getAppVersion, getModuleVersion };
