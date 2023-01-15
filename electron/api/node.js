const ping = require("ping");
const package = require("../package.json");

const probeConnection = async (_event, target) => {
  const result = await ping.promise.probe(target);
  return { output: result.alive };
};

const getVersion = async (_event) => {
  const isBeta = process.env.AD_TOOLS_PRERELEASE.toLowerCase() === "true";
  return { output: { version: package.version, isBeta } };
};

module.exports = { probeConnection, getVersion };
