const ping = require("ping");

const probeConnection = async (_event, target) => {
  const result = await ping.promise.probe(target);
  return { output: result.alive };
};

module.exports = { probeConnection };
