import { useEffect, useState } from "react";

import { getTenants } from "../../Helper/getSavedConfig";
import { makeAPICall } from "../../Helper/makeAPICall";
import { useGlobalState } from "../../Hooks/useGlobalState";
import { addMessage } from "../../Helper/handleMessage";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type AadInputBarProps = {
  label: string;
  hint?: string;
  isLoading: boolean;
  query: AadQuery;
  onChange: (query: AadQuery) => any;
  onSubmit: () => any;
  children?: React.ReactNode;
};
export default function AadInputBar({
  label,
  hint,
  isLoading,
  query,
  onChange,
  onSubmit,
  children,
}: AadInputBarProps) {
  const { setState } = useGlobalState();
  const tenants = getTenants();
  const [input, setInput] = useState<string>(query.input ?? "");
  const [tenant, setTenant] = useState<string>(query.tenant ?? tenants[0]);

  useEffect(() => {
    onChange({ input, tenant });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, tenant]);

  const azureLogout = async () => {
    const result = await makeAPICall({
      command: "Disconnect-AzureAD",
      useStaticSession: true,
      json: false,
    });

    if (result.error) {
      addMessage({ type: "error", message: "failed to log out" }, setState);

      return;
    }
    addMessage({ type: "info", message: "logged out successfully", timer: 7 }, setState);
  };

  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-center [&>*]:m-1">
        <Input
          label={label}
          value={input}
          classOverride="w-64"
          disabled={isLoading}
          onChange={setInput}
          onEnter={onSubmit}
        />
        {tenants.length !== 0 && (
          <>
            <Dropdown items={tenants} value={tenant} disabled={isLoading} onChange={setTenant} />
            <Button onClick={azureLogout} disabled={isLoading} children="Logout" />
          </>
        )}
        <Button onClick={onSubmit} disabled={isLoading} children="Run" />
        {children}
      </div>
      {hint && <span className="ml-1 dark:text-whiteColorAccent">{hint}</span>}
    </div>
  );
}
