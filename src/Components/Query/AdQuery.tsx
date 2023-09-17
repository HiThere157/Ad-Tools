import Button from "../Button";
import Dropdown from "../Dropdown";
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
    <div className="flex items-center gap-1 p-2">
      <label className="flex items-center gap-2">
        <span>Name:</span>

        <Input
          value={filter.name ?? ""}
          onChange={(name) => {
            setQuery({ ...query, filter: { ...filter, name } });
          }}
          onEnter={onSubmit}
        />
      </label>

      <Dropdown
        items={availableServers}
        value={servers}
        onChangeMulti={(servers) => {
          setQuery({ ...query, servers });
        }}
      />

      <Button onClick={onSubmit}>Run</Button>
    </div>
  );
}
