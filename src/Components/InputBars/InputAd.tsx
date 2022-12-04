import { useEffect, useState } from "react";

import { getDomains } from "../../Helper/getSavedConfig";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type AdInputBarProps = {
  label: string,
  isLoading: boolean,
  query: { input: string | undefined, domain: string | undefined },
  onChange: Function,
  onSubmit: Function,
}
export default function AdInputBar({ label, isLoading, query, onChange, onSubmit }: AdInputBarProps) {
  const [domains, setDomains] = useState<string[]>([]);
  const [input, setInput] = useState(query.input ?? "");
  const [domain, setDomain] = useState(query.domain);

  useEffect(() => {
    onChange({ input, domain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, domain]);

  useEffect(() => {
    (async () => {
      const domains = await getDomains();
      setDomains(domains);
      setDomain(query.domain ?? domains[0]);
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Dropdown items={domains} value={domain} disabled={isLoading} onChange={setDomain} />
      <Button onClick={onSubmit} disabled={isLoading} children="Run" />
    </div>
  );
}
