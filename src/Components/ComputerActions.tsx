import { useLocalStorage } from "../Hooks/useStorage";

import { electronAPI } from "../Helper/makeAPICall";

import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

import Button from "./Button";
import Checkbox from "./Checkbox";

type ComputerActionsProps = {
  fqdn: string;
};
export default function ComputerActions({ fqdn }: ComputerActionsProps) {
  const { setState } = useGlobalState();
  const [useCurrentUser, setUseCurrentUser] = useLocalStorage<boolean>(
    "actions_useCurrentUser",
    true,
  );

  const run = async (action: ComputerAction, friendlyName: string) => {
    try {
      const result = await electronAPI?.startComputerAction({
        action,
        target: fqdn,
        useCurrentUser,
      });

      if (!result) {
        throw new Error("electronAPI not exposed.");
      }

      if (result?.error) {
        throw result.error;
      }
      addMessage(
        {
          type: "info",
          message: `Opened ${friendlyName} for Target: ${fqdn}`,
          timer: 7,
        },
        setState,
      );
    } catch {
      addMessage(
        {
          type: "error",
          message: `Failed to open ${friendlyName} for Target: ${fqdn}`,
        },
        setState,
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between [&>*]:m-1 mb-2">
      <Button
        className="flex-grow"
        onClick={() => run("compmgmt", "computer management")}
        children="Computer Management"
      />
      <Button
        className="flex-grow"
        onClick={() => run("powershell", "a powershell session")}
        children="Powershell"
      />
      <Button className="flex-grow" onClick={() => run("mstsc", "a RDP session")} children="RDP" />
      <Checkbox
        className="ml-1"
        label="use current user"
        checked={useCurrentUser}
        onChange={() => setUseCurrentUser(!useCurrentUser)}
      />
    </div>
  );
}
