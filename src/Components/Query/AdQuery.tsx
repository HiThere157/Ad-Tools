import { useQueryDomains } from "../../Helper/api";

import Button from "../Button";
// import Dropdown from "../Dropdown/Dropdown";
import MultiDropdown from "../Dropdown/MultiDropdown";
import Input from "../Input/Input";

type AdQueryProps = {
  query: AdQuery;
  setQuery: (query: AdQuery) => void;
  onSubmit: () => void;
};
export default function AdQuery({ query, setQuery, onSubmit }: AdQueryProps) {
  const availableServers = useQueryDomains();
  const { filter, servers } = query;

  return (
    <div className="m-1.5 mb-4 flex items-center gap-1">
      <label className="flex items-center gap-2">
        <span>Identity:</span>

        <Input
          value={filter.Name ?? ""}
          onChange={(Name) => {
            setQuery({ ...query, filter: { ...filter, Name } });
          }}
          onEnter={onSubmit}
        />
      </label>

      {/* <Dropdown
        items={availableServers}
        value={servers[0] || availableServers[0]}
        onChange={(server) => {
          setQuery({ ...query, servers: [server] });
        }}
      /> */}

      <MultiDropdown
        items={availableServers}
        value={servers}
        onChange={(servers) => {
          setQuery({ ...query, servers });
        }}
      />

      <Button onClick={onSubmit}>Run</Button>
    </div>
  );
}
