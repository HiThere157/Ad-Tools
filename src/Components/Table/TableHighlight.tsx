import Button from "../Button";
import ColorInput from "../Input/ColorInput";
import MultiInput from "../Input/MultiInput";

import { BsTrashFill } from "react-icons/bs";

type TableHighlightProps = {
  highlight: TableHighlight;
  setHighlight: (highlight: TableHighlight) => void;
  removeHighlight: () => void;
};
export default function TableHighlight({
  highlight,
  setHighlight,
  removeHighlight,
}: TableHighlightProps) {
  const { color, fields } = highlight;

  return (
    <>
      <ColorInput value={color} onChange={(color) => setHighlight({ ...highlight, color })} />
      <MultiInput value={fields} onChange={(fields) => setHighlight({ ...highlight, fields })} />

      <Button className="p-1 text-red" onClick={removeHighlight}>
        <BsTrashFill />
      </Button>
    </>
  );
}
