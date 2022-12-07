import { useEffect, useState } from "react";

import { getTenants } from "../../Helper/getSavedConfig";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type AadInputBarProps = {
  label: string;
  hint?: string;
  isLoading: boolean;
  query: { input: string | undefined; tenant: string | undefined };
  onChange: Function;
  onSubmit: Function;
};
export default function AadInputBar({
  label,
  hint,
  isLoading,
  query,
  onChange,
  onSubmit,
}: AadInputBarProps) {
  const tenants = getTenants();
  const [input, setInput] = useState(query.input ?? "");
  const [tenant, setTenant] = useState(query.tenant ?? tenants[0]);

  useEffect(() => {
    onChange({ input, tenant });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, tenant]);

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
          <Dropdown
            items={tenants}
            value={tenant}
            disabled={isLoading}
            onChange={setTenant}
          />
        )}
        <Button onClick={onSubmit} disabled={isLoading} children="Run" />
      </div>
      {hint && <span className="ml-1 dark:text-foregroundAccent">{hint}</span>}
    </div>
  );
}
