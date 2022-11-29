import { ElectronAPI, ComputerAction } from "../Types/api";

import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

import Button from "./Button";

type ComputerActionsProps = {
  fqdn: string,
}
export default function ComputerActions({ fqdn }: ComputerActionsProps) {
  const { setState } = useGlobalState();

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
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Button onClick={() => run("compmgmt", "computer management")} children="Computer Management" />
      <Button onClick={() => run("powershell", "a powershell session")} children="Powershell" />
      <Button onClick={() => run("mstsc", "a RDP session")} children="RDP" />
      <Button onClick={() => run("mstsc_admin", "an admin RDP session")} children="RDP (admin)" />
    </div>
  );
}
