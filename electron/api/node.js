const ping = require("ping");
const package = require("../package.json");

const probeConnection = async (_event, target) => {
  const result = await ping.promise.probe(target);
  return { output: result.alive };
};

const getVersion = async (_event) => {
  return { output: package.version };
};

module.exports = { probeConnection, getVersion };
