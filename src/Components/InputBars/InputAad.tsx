import { useEffect, useState } from "react";

import { getTenants } from "../../Helper/getSavedConfig";
import { azureLogout } from "../../Helper/azureAuth";

import Input from "../Input";
import Button from "../Button";

type AadInputBarProps = {
  label: string;
  hint?: string;
  isLoading: boolean;
  query: AadQuery;
  onChange: (query: AadQuery) => any;
  onSubmit: () => any;
  children?: React.ReactNode;
};
export default function AadInputBar({
  label,
  hint,
  isLoading,
  query,
  onChange,
  onSubmit,
  children,
}: AadInputBarProps) {
  const tenants = getTenants();
  const [input, setInput] = useState<string>(query.input ?? "");

  useEffect(() => {
    onChange({ input });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-center [&>*]:m-1">
        <Input
          label={label}
          value={input}
          classOverride="w-64"
          disabled={isLoading}
          onChange={setInput}
          onEnter={onSubmit}
        />
        {tenants.length !== 0 && (
          <>
            <Button onClick={azureLogout} disabled={isLoading}>
              Logout
            </Button>
          </>
        )}
        <Button onClick={onSubmit} disabled={isLoading}>
          Run
        </Button>
        {children}
      </div>
      {hint && <span className="ml-1 dark:text-whiteColorAccent">{hint}</span>}
    </div>
  );
}
