import { useEffect, useState } from "react";

import { tenants } from "../../Config/default";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type AadInputBarProps = {
  label: string,
  isLoading: boolean,
  query: { input: string | undefined, tenant: string | undefined },
  onChange: Function,
  onSubmit: Function,
}
export default function AadInputBar({ label, isLoading, query, onChange, onSubmit }: AadInputBarProps) {
  const [input, setInput] = useState(query.input ?? "");
  const [tenant, setTenant] = useState(query.tenant ?? tenants[0]);

  useEffect(() => {
    onChange({ input, tenant });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, tenant]);

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={input}
        classOverride="w-64"
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown items={tenants} value={tenant} onChange={setTenant} />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
    </div>
  );
}
