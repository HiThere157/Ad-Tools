import { PowerShell } from "node-powershell";

function makeToArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
function tagArray(array: RawResultObject[]): ResultObject[] {
  return array.map((item, itemIndex) => ({ ...item, __id__: itemIndex }));
}

const globalSession = new PowerShell();

export async function invokePSCommand(
  _event: Electron.IpcMainInvokeEvent,
  { command, selectFields }: InvokePSCommandRequest,
): Promise<DataSet> {
  // If the command should use the global session, use it
  const startTimestamp = Date.now();

  try {
    if (selectFields) {
      command += ` | Select-Object ${selectFields.join(", ")}`;
    }
    command += ` | ConvertTo-Json -Compress`;

    const output = await globalSession.invoke(command);
    const data = tagArray(makeToArray<RawResultObject>(JSON.parse(output.raw || "[]")));
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
  }
}
