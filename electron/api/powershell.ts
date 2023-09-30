import { PowerShell } from "node-powershell";

function makeToArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
function tagArray(array: RawPSResult[]): PSResult[] {
  return array.map((item, index) => ({ ...item, __id__: index }));
}

function createPSSession() {
  // Create a new session
  return new PowerShell();
}
const globalSession = createPSSession();

export async function invokePSCommand(
  _event: Electron.IpcMainInvokeEvent,
  { useGlobalSession, command, fields }: InvokePSCommandRequest,
): Promise<Loadable<PSDataSet>> {
  // If the command should use the global session, use it
  const session = useGlobalSession ? globalSession : createPSSession();
  const startTimestamp = Date.now();

  try {
    if (fields) {
      command += ` | Select-Object ${fields.join(", ")}`;
    }
    command += ` | ConvertTo-Json -Compress`;

    const output = await session.invoke(command);
    const data = tagArray(makeToArray<RawPSResult>(JSON.parse(output.raw ?? "[]")));
    const endTimestamp = Date.now();

    return {
      result: {
        data,
        columns: fields ?? Object.keys(data[0] ?? {}),
      },
      timestamp: endTimestamp,
      executionTime: endTimestamp - startTimestamp,
    };
  } catch (error) {
    const endTimestamp = Date.now();

    return {
      error: (error as Error).toString().split("At line:1")[0],
      timestamp: endTimestamp,
      executionTime: endTimestamp - startTimestamp,
    };
  } finally {
    // Dispose of the session if it's not the global session
    if (!useGlobalSession) {
      session.dispose();
    }
  }
}
