import { useEffect, useState } from "react";

import { dnsTypes } from "../../Config/default";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type DnsInputBarProps = {
  label: string,
  isLoading: boolean,
  query: { input: string | undefined, type: string | undefined },
  onChange: Function,
  onSubmit: Function,
}
export default function DnsInputBar({ label, isLoading, query, onChange, onSubmit }: DnsInputBarProps) {
  const [input, setInput] = useState(query.input ?? "");
  const [type, setType] = useState(query.type ?? dnsTypes[0]);

  useEffect(() => {
    onChange({ input, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, type]);

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={input}
        classOverride="w-64"
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown items={dnsTypes} value={type} onChange={setType} />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
    </div>
  );
}
