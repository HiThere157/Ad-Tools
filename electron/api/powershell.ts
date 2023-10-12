import { PowerShell } from "node-powershell";

function makeToArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
function tagArray(array: RawPSResult[]): PSResult[] {
  return array.map((item, itemIndex) => ({ ...item, __id__: itemIndex }));
}

const globalSession = new PowerShell();

export async function invokePSCommand(
  _event: Electron.IpcMainInvokeEvent,
  { useGlobalSession, command, selectFields }: InvokePSCommandRequest,
): Promise<Loadable<PSDataSet>> {
  // If the command should use the global session, use it
  const session = useGlobalSession ? globalSession : new PowerShell();
  const startTimestamp = Date.now();

  try {
    if (selectFields) {
      command += ` | Select-Object ${selectFields.join(", ")}`;
    }
    command += ` | ConvertTo-Json -Compress`;

    const output = await session.invoke(command);
    const data = tagArray(makeToArray<RawPSResult>(JSON.parse(output.raw || "[]")));
    const endTimestamp = Date.now();

    return {
      result: {
        data,
        columns: selectFields ?? Object.keys(data[0] ?? {}),
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
