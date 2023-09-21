import { Powershell } from "node-powershell";

const sessions = {};

const createPSSession = (id) => {
  // Create a new session
  const session = new Powershell({
    executionPolicy: "Bypass",
    noProfile: true,
  });

  // Store the session in the sessions object
  sessions[id] = session;

  return { id, session };
};

const invokePSCommand = async ({ shell, command, json = true, dispose = true }) => {
  const { id, session } = shell;

  try {
    const output = await session.invoke(command);
    const result = output.raw;

    // If the command returns nothing, return an empty object - no result and no error
    if (!result) return {};

    // If the command does not return JSON, return the raw result
    if (!json) return { result: output.raw };

    // If the command returns JSON, parse it and return the result
    return { result: JSON.parse(output.raw) };
  } catch (error) {
    // If the command returns an error, return the error
    return { error: error.toString().split("At line:1")[0] };
  } finally {
    // Dispose of the session if requested and delete it from the sessions object
    if (dispose) {
      session.dispose();
      delete sessions[id];
    }
  }
};

invokePSCommand({
  shell: createPSSession(),
  command: "Get-Process",
  json: 2,
  dispose: true,
});
