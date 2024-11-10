const packageJson = require("../../package.json");

export function getElectronEnvironment(): ElectronEnvironment {
  return {
    executingUser: `${process.env.USERDOMAIN}\\${process.env.USERNAME}`,
    appVersion: "v" + packageJson.version,
    appChannel: process.env.AD_TOOLS_PRERELEASE === "true" ? "beta" : "stable",
  };
}
