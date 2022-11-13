import Expandable from "./Expandable";

type TableCellProps = {
  text: any
}
export default function TableCell({ text }: TableCellProps) {
  const stringify = (object: object) => {
    return JSON.stringify(object, null, 2);
  };

  switch (typeof text) {
    case "object":
      return (
        <Expandable canExpand={stringify(text)?.split("\n").length !== 1}>
          <pre>{stringify(text)}</pre>
        </Expandable>
      );

    case "boolean":
      return <>{text ? "True" : "False"}</>;

    default:
      return text;
  }
}