import { useLocalStorage } from "../../Hooks/useStorage";

import Popup from "./Popup";
import Button from "../Button";
import Input from "../Input";
import Tab from "../Tab/Tab";
import TabControl from "../Tab/TabControl";

type AzureLoginProps = {
  isOpen: boolean;
  onExit: () => any;
  onSubmit: () => any;
};
export default function AzureLogin({ isOpen, onExit, onSubmit }: AzureLoginProps) {
  const [upn, setUpn] = useLocalStorage<string>("conf_AzureLastUpn", "");
  const [useCredentials, setUseCredentials] = useLocalStorage<boolean>(
    "conf_AzureUseCredentials",
    false,
  );

  return (
    <Popup title="Azure Login" isOpen={isOpen} onExit={onExit}>
      <TabControl
        defaultIndex={useCredentials ? 1 : 0}
        onChange={(newIndex: number) => setUseCredentials(newIndex === 1)}
      >
        <Tab title="Web (SSO)">
          <LoginFrame onCancel={onExit} onSubmit={onSubmit}>
            <Input label="UPN:" value={upn} classOverride="w-56" onChange={setUpn} />
          </LoginFrame>
        </Tab>
        <Tab title="Credentials">
          <LoginFrame onCancel={onExit} onSubmit={onSubmit} />
        </Tab>
      </TabControl>
    </Popup>
  );
}

type LoginFrameProps = {
  children?: React.ReactNode;
  onCancel: () => any;
  onSubmit: () => any;
};
function LoginFrame({ children, onCancel, onSubmit }: LoginFrameProps) {
  return (
    <div className="flex flex-col items-center">
      {children}
      <div className="flex gap-2 text-lg mt-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button theme="color" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
