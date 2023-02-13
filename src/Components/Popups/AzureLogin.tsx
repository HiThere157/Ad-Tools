import { useState } from "react";
import { useLocalStorage } from "../../Hooks/useStorage";

import { azureLogin } from "../../Helper/azureAuth";
import { useGlobalState } from "../../Hooks/useGlobalState";
import { addMessage } from "../../Helper/handleMessage";

import Popup from "./Popup";
import Button from "../Button";
import Input from "../Input";
import Tab from "../Tab/Tab";
import TabControl from "../Tab/TabControl";

type AzureLoginProps = {
  isOpen: boolean;
  onExit: () => any;
};
export default function AzureLogin({ isOpen, onExit }: AzureLoginProps) {
  const { setState } = useGlobalState();
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false);

  const [upn, setUpn] = useLocalStorage<string>("conf_azureLastUpn", "");
  const [useCredentials, setUseCredentials] = useLocalStorage<boolean>(
    "conf_azureUseCredentials",
    false,
  );

  const login = async () => {
    setIsNoteOpen(true);
    const success = await azureLogin();

    if (success) {
      addMessage({ type: "info", message: "Logged In", timer: 7 }, setState);
    } else {
      addMessage(
        { type: "error", message: "Failed to Log In (cancelled / module missing)" },
        setState,
      );
    }

    setIsNoteOpen(false);
    onExit();
  };

  return (
    <Popup title="Azure Login" isOpen={isOpen} onExit={onExit}>
      <TabControl
        defaultIndex={useCredentials ? 1 : 0}
        onChange={(newIndex: number) => setUseCredentials(newIndex === 1)}
      >
        <Tab title="Web (SSO)">
          <LoginFrame isNoteOpen={isNoteOpen} onCancel={onExit} onSubmit={login}>
            <Input
              label="UPN:"
              value={upn}
              classOverride="w-56"
              disabled={isNoteOpen}
              onChange={setUpn}
              onEnter={login}
            />
          </LoginFrame>
        </Tab>
        <Tab title="Credentials">
          <LoginFrame isNoteOpen={isNoteOpen} onCancel={onExit} onSubmit={login} />
        </Tab>
      </TabControl>
    </Popup>
  );
}

type LoginFrameProps = {
  children?: React.ReactNode;
  isNoteOpen: boolean;
  onCancel: () => any;
  onSubmit: () => any;
};
function LoginFrame({ children, isNoteOpen, onCancel, onSubmit }: LoginFrameProps) {
  return (
    <div className="flex flex-col items-center">
      {children}
      <div className="flex gap-2 text-lg mt-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button theme="color" disabled={isNoteOpen} onClick={onSubmit}>
          Submit
        </Button>
      </div>

      {isNoteOpen && (
        <span className="mt-2 text-center dark:text-redColor">
          login popup opened.
          <br />
          (check behind other windows aswell)
        </span>
      )}
    </div>
  );
}
