import { useEffect, useState } from "react";

import { AadQuery } from "../../Types/api";

import { getTenants } from "../../Helper/getSavedConfig";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type AadInputBarProps = {
  label: string;
  hint?: string;
  isLoading: boolean;
  query: AadQuery;
  onChange: (query: {}) => any;
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
  const tenants = getTenants();
  const [input, setInput] = useState<string>(query.input ?? "");
  const [tenant, setTenant] = useState<string>(query.tenant ?? tenants[0]);

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
          <Dropdown items={tenants} value={tenant} disabled={isLoading} onChange={setTenant} />
        )}
        <Button onClick={onSubmit} disabled={isLoading} children="Run" />
        {children}
      </div>
      {hint && <span className="ml-1 dark:text-foregroundAccent">{hint}</span>}
    </div>
  );
}
