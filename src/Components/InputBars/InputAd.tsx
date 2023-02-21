import { useEffect, useState } from "react";

import { getDomains } from "../../Helper/getSavedConfig";

import Input from "../Input";
import Dropdown from "../Dropdown";
import Button from "../Button";

type AdInputBarProps = {
  label: string;
  isLoading: boolean;
  isBlocked?: boolean;
  query: AdQuery;
  onChange: (query: AdQuery) => any;
  onSubmit: () => any;
  children?: React.ReactNode;
};
export default function AdInputBar({
  label,
  isLoading,
  isBlocked = false,
  query,
  onChange,
  onSubmit,
  children,
}: AdInputBarProps) {
  const [domains, setDomains] = useState<string[]>([]);
  const [input, setInput] = useState<string>(query.input ?? "");
  const [domain, setDomain] = useState<string>(query.domain ?? domains[0]);

  useEffect(() => {
    onChange({ input, domain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, domain]);

  useEffect(() => {
    (async () => {
      const domains = await getDomains();
      setDomains(domains);
      setDomain(query.domain ?? domains[0]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={input}
        classList="w-64"
        disabled={isLoading || isBlocked}
        onChange={setInput}
        onEnter={onSubmit}
      />
      <Dropdown
        items={domains}
        value={domain}
        placeholder="No Domain"
        disabled={isLoading}
        onChange={setDomain}
      />
      <Button onClick={onSubmit} disabled={isLoading}>
        Run
      </Button>
      {children}
    </div>
  );
}
