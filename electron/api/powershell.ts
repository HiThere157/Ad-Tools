import { PowerShell } from "node-powershell";

const createPSSession = () => {
  // Create a new session
  return new PowerShell();
};
const globalSession = createPSSession();

export const invokePSCommand = async (
  _event: Electron.IpcMainInvokeEvent,
  { useGlobalSession, command, fields }: InvokePSCommandRequest,
): Promise<Loadable<PSResult>> => {
  // If the command should use the global session, use it
  const session = useGlobalSession ? globalSession : createPSSession();

  // If the command should return specific fields, append the Select-Object command
  if (fields) {
    command += ` | Select-Object ${fields.join(", ")}`;
  }

  try {
    const output = await session.invoke(command + " | ConvertTo-Json -Compress");
    const result = output.raw;

    // If the command returns nothing, return an empty object - no result and no error
    if (!result) return {};

    // If the command returns JSON, parse it and return the result

    //////////////////////////////////////// TODO: return only array and tag it with __id__ ////////////////////////////////////////
    return { result: JSON.parse(output.raw) as PSResult };
  } catch (error) {
    // If the command returns an error, return the error
    return { error: (error as Error).toString().split("At line:1")[0] };
  } finally {
    // Dispose of the session if requested and delete it from the sessions object
    if (!useGlobalSession) {
      session.dispose();
    }
  }
};
