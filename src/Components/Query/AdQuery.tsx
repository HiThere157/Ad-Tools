import { useLayoutEffect } from "react";

import { defaultAdQuery } from "../../Config/default";
import { useQueryDomains } from "../../Helper/api";

import Button from "../Button";
import Checkbox from "../Checkbox";
import MultiDropdown from "../Dropdown/MultiDropdown";
import Input from "../Input/Input";

type AdQueryProps = {
  query: AdQuery;
  setQuery: (query: AdQuery) => void;
  onSubmit: () => void;
};
export default function AdQuery({ query, setQuery, onSubmit }: AdQueryProps) {
  const availableServers = useQueryDomains();
  const { isAdvanced, filter, servers } = query;

  const beforeSubmit = () => {
    if (Object.keys(filter).length === 0 || servers.length === 0) return;
    onSubmit();
  };

  useLayoutEffect(() => {
    if (query === defaultAdQuery && availableServers.length > 0) {
      setQuery({ ...query, servers: [availableServers[0]] });
    }
  }, [availableServers]);

  return (
    <div className="m-1.5 mb-4 flex items-center gap-1">
      <label className="flex items-center gap-2">
        <span>Identity:</span>

        <Input
          value={filter.Name ?? ""}
          onChange={(Name) => {
            setQuery({ ...query, filter: { ...filter, Name } });
          }}
          onEnter={beforeSubmit}
        />
      </label>

      <MultiDropdown
        items={availableServers}
        value={servers}
        onChange={(servers) => {
          setQuery({ ...query, servers });
        }}
      />

      <Button onClick={beforeSubmit}>Run</Button>

      <label className="ml-2 flex items-center gap-1.5">
        <Checkbox
          checked={isAdvanced}
          onChange={(isAdvanced) => {
            setQuery({ ...query, isAdvanced });
          }}
        />
        <span>Advanced</span>
      </label>
    </div>
  );
}
