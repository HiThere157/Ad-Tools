import Button from "../Button";
import MultiDropdown from "../Dropdown/MultiDropdown";
import Input from "../Input";

type AdQueryProps = {
  query: AdQuery;
  setQuery: (query: AdQuery) => void;
  onSubmit: () => void;
};
export default function AdQuery({ query, setQuery, onSubmit }: AdQueryProps) {
  const availableServers = ["domain1", "domain2", "domain3"];
  const { filter, servers } = query;

  return (
    <div className="m-2 mb-5 flex items-center gap-1">
      <label className="flex items-center gap-2">
        <span>Identity:</span>

        <Input
          value={filter.name ?? ""}
          onChange={(name) => {
            setQuery({ ...query, filter: { ...filter, name } });
          }}
          onEnter={onSubmit}
        />
      </label>

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
