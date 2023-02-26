import Input from "../Input";
import Button from "../Button";

type AadInputBarProps = {
  label: string;
  isLoading: boolean;
  query: AadQuery;
  onChange: (query: AadQuery) => any;
  onSubmit: () => any;
  children?: React.ReactNode;
};
export default function AadInputBar({
  label,
  isLoading,
  query,
  onChange,
  onSubmit,
  children,
}: AadInputBarProps) {
  return (
    <div className="flex flex-wrap items-center [&>*]:m-1 mb-2">
      <Input
        label={label}
        value={query.input ?? ""}
        className="w-64"
        disabled={isLoading}
        onChange={(input) => onChange({ input })}
        onEnter={onSubmit}
      />
      <Button onClick={onSubmit} disabled={isLoading}>
        Run
      </Button>
      {children}
    </div>
  );
}
