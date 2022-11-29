import { useLocalStorage } from "../Hooks/useStorage";

import { ElectronAPI, ComputerAction } from "../Types/api";

import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

import Button from "./Button";
import Checkbox from "./Checkbox";

type ComputerActionsProps = {
  fqdn: string,
}
export default function ComputerActions({ fqdn }: ComputerActionsProps) {
  const { setState } = useGlobalState();
  const [useCurrentUser, setUseCurrentUser] = useLocalStorage("actions_useCurrentUser", true);

  const run = async (action: ComputerAction, friendlyName: string) => {
    try {
      const result = await (window as ElectronAPI).electronAPI.startComputerAction(action, fqdn);

      if (result.error) {
        throw result.error;
      }
      addMessage({ type: "info", message: `opened ${friendlyName} for target: ${fqdn}`, timer: 7 }, setState);
    } catch {
      addMessage({ type: "error", message: `failed to open ${friendlyName} for target: ${fqdn}` }, setState);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between [&>*]:m-1 mb-2">
      <Button classOverride="flex-grow" onClick={() => run("compmgmt", "computer management")} children="Computer Management" />
      <Button classOverride="flex-grow" onClick={() => run("powershell", "a powershell session")} children="Powershell" />
      <Button classOverride="flex-grow" onClick={() => run("mstsc", "a RDP session")} children="RDP" />
      <Checkbox classOverride="ml-1" label="use current user" checked={useCurrentUser} onChange={() => setUseCurrentUser(!useCurrentUser)} />
    </div>
  );
}
