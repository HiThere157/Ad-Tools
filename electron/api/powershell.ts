import { PowerShell } from "node-powershell";

const makeToArray = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
};
const tagArray = (array: RawPSResult[]): PSResult[] => {
  return array.map((item, index) => ({ ...item, __id__: index }));
};

const createPSSession = () => {
  // Create a new session
  return new PowerShell();
};
const globalSession = createPSSession();

export const invokePSCommand = async (
  _event: Electron.IpcMainInvokeEvent,
  { useGlobalSession, command, fields }: InvokePSCommandRequest,
): Promise<Loadable<PSDataSet>> => {
  // If the command should use the global session, use it
  const session = useGlobalSession ? globalSession : createPSSession();

  try {
    const startTimestamp = Date.now();
    const output = await session.invoke(
      command + ` | Select-Object ${fields.join(", ")} | ConvertTo-Json -Compress`,
    );
    const endTimestamp = Date.now();

    return {
      result: {
        timestamp: endTimestamp,
        executionTime: endTimestamp - startTimestamp,
        data: tagArray(makeToArray<RawPSResult>(JSON.parse(output.raw ?? "[]"))),
        columns: fields,
      },
    };
  } catch (error) {
    return { error: (error as Error).toString().split("At line:1")[0] };
  } finally {
    // Dispose of the session if it's not the global session
    if (!useGlobalSession) {
      session.dispose();
    }
  }
};
