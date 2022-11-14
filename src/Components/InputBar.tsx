import { useEffect, useState } from "react";

import { domains } from "../Config/default";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

import PulseLoader from "react-spinners/PulseLoader";

type InputBarProps = {
  isLoading: boolean,
  query: { input: string | undefined, domain: string | undefined },
  onChange: Function,
  onSubmit: Function,
}
export default function InputBar({ isLoading, query, onChange, onSubmit }: InputBarProps) {
  const [input, setInput] = useState(query.input ?? "");
  const [domain, setDomain] = useState(query.domain ?? domains[0]);

  useEffect(() => {
    onChange({ input, domain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, domain]);

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label="User ID:"
        value={input}
        classOverride="w-64"
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown items={domains} value={domain} onChange={setDomain} />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
      <PulseLoader
        size="12px"
        color="#208CF0"
        loading={isLoading}
        speedMultiplier={0.75}
      />
    </div>
  );
}
