import { useEffect, useState } from "react";

import stringify from "../../Helper/stringify";

import Expandable from "./Expandable";

type TableCellProps = {
  text: any;
};
export default function TableCell({ text }: TableCellProps) {
  const [stringText, setStringText] = useState<string>("");

  useEffect(() => {
    setStringText(stringify(text));
  }, [text]);

  if (typeof text === "object") {
    return (
      <Expandable canExpand={stringText.split("\n").length !== 1}>
        <pre>{stringText}</pre>
      </Expandable>
    );
  }

  return <pre>{stringText}</pre>;
}
