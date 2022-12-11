import { useEffect, useState } from "react";

import { DnsQuery } from "../../Types/api";

import { dnsTypes } from "../../Config/default";
import { makeAPICall } from "../../Helper/makeAPICall";
import { useGlobalState } from "../../Hooks/useGlobalState";
import { addMessage } from "../../Helper/handleMessage";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type DnsInputBarProps = {
  label: string;
  isLoading: boolean;
  query: DnsQuery;
  onChange: (query: {}) => any;
  onSubmit: () => any;
  children?: React.ReactNode;
};
export default function DnsInputBar({
  label,
  isLoading,
  query,
  onChange,
  onSubmit,
  children,
}: DnsInputBarProps) {
  const { setState } = useGlobalState();
  const [input, setInput] = useState<string>(query.input ?? "");
  const [type, setType] = useState<string>(query.type ?? dnsTypes[0]);

  useEffect(() => {
    onChange({ input, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, type]);

  const clearCache = async () => {
    const result = await makeAPICall({
      command: "Clear-DnsClientCache",
    });

    if (result.error) {
      addMessage({ type: "error", message: "failed to clear DNS cache" }, setState);
      return;
    }
    addMessage({ type: "info", message: "cleared DNS cache", timer: 7 }, setState);
  };

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={input}
        classOverride="w-64"
        disabled={isLoading}
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown items={dnsTypes} value={type} disabled={isLoading} onChange={setType} />
      <Button onClick={clearCache} disabled={isLoading} children="Clear Cache" />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
      {children}
    </div>
  );
}
