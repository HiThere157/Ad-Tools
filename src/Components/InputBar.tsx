import { useEffect, useState } from "react";

import { domains } from "../Config/default";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

type InputBarProps = {
  label: string,
  isLoading: boolean,
  query: { input: string | undefined, domain: string | undefined },
  onChange: Function,
  onSubmit: Function,
}
export default function InputBar({ label, isLoading, query, onChange, onSubmit }: InputBarProps) {
  const [input, setInput] = useState(query.input ?? "");
  const [domain, setDomain] = useState(query.domain ?? domains[0]);

  useEffect(() => {
    onChange({ input, domain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, domain]);

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={input}
        classOverride="w-64"
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown items={domains} value={domain} onChange={setDomain} />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
    </div>
  );
}
