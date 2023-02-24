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

  useEffect(() => {
    (async () => {
      const domains = await getDomains();
      setDomains(domains);
      onChange({ input: query.input, domain: query.domain ?? domains[0] });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={query.input ?? ""}
        classList="w-64"
        disabled={isLoading || isBlocked}
        onChange={(input) => onChange({ domain: query.domain, input })}
        onEnter={onSubmit}
      />
      <Dropdown
        items={domains}
        value={query.domain}
        placeholder="No Domain"
        disabled={isLoading}
        onChange={(domain) => onChange({ input: query.input, domain })}
      />
      <Button onClick={onSubmit} disabled={isLoading}>
        Run
      </Button>
      {children}
    </div>
  );
}
