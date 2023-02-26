import { useEffect } from "react";

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
  onChange: (query: DnsQuery) => any;
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

  useEffect(() => {
    onChange({ input: query.input, type: query.type ?? dnsTypes[0] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearCache = async () => {
    const result = await makeAPICall({
      command: "Clear-DnsClientCache",
    });

    if (result.error) {
      addMessage({ type: "error", message: "Failed to clear DNS Cache" }, setState);
      return;
    }
    addMessage({ type: "info", message: "Cleared DNS Cache", timer: 7 }, setState);
  };

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={query.input ?? ""}
        className="w-64"
        disabled={isLoading}
        onChange={(input) => onChange({ type: query.type, input })}
        onEnter={onSubmit}
      />
      <Dropdown
        items={dnsTypes}
        value={query.type}
        disabled={isLoading}
        onChange={(type) => onChange({ input: query.input, type })}
      />
      <Button onClick={clearCache} disabled={isLoading}>
        Clear Cache
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        Run
      </Button>
      {children}
    </div>
  );
}
