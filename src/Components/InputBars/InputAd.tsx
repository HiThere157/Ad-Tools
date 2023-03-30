import { useEffect, useState } from "react";

import { getDomains } from "../../Helper/getSavedConfig";

import Input from "../Input";
import Dropdown from "../Dropdown/Dropdown";
import MultiDropdown from "../Dropdown/MultiDropdown";
import Button from "../Button";

type AdInputBarProps = {
  label: string;
  isLoading: boolean;
  isBlocked?: boolean;
  query: AdQuery;
  multiDomain?: boolean;
  onChange: (query: AdQuery) => any;
  onSubmit: () => any;
  children?: React.ReactNode;
};
export default function AdInputBar({
  label,
  isLoading,
  isBlocked = false,
  query,
  multiDomain = false,
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
        className="w-64"
        disabled={isLoading || isBlocked}
        onChange={(input) => onChange({ domain: query.domain, input })}
        onEnter={onSubmit}
      />
      {multiDomain ? (
        <MultiDropdown
          items={domains}
          values={query.domain?.split(",")}
          disabled={isLoading}
          onChange={(domains) =>
            onChange({
              input: query.input,
              domain: domains.length === 0 ? undefined : domains.join(","),
            })
          }
        />
      ) : (
        <Dropdown
          items={domains}
          value={query.domain}
          disabled={isLoading}
          onChange={(domain) => onChange({ input: query.input, domain })}
        />
      )}
      <Button onClick={onSubmit} disabled={isLoading}>
        Run
      </Button>
      {children}
    </div>
  );
}
