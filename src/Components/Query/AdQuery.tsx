import Button from "../Button";
import Dropdown from "../Dropdown";
import Input from "../Input";

type AdQueryProps = {
  query: AdQuery;
  setQuery: (query: AdQuery) => void;
  onSubmit: () => void;
};
export default function AdQuery({ query, setQuery, onSubmit }: AdQueryProps) {
  const servers = ["domain1", "domain2", "domain3"];

  const name = query.filter?.["name"] ?? "";
  const server = query.server ?? servers[0];

  return (
    <div className="flex items-center gap-1 p-2">
      <Input
        label="Name:"
        value={name}
        onChange={(newName) => {
          setQuery({ ...query, filter: { ...query.filter, name: newName } });
        }}
        onEnter={onSubmit}
      />
      <Dropdown
        items={servers}
        value={server}
        onChange={(newServer) => {
          setQuery({ ...query, server: newServer });
        }}
      />

      <Button onClick={onSubmit}>Run</Button>
    </div>
  );
}
