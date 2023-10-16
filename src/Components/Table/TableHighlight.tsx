import Button from "../Button";
import ColorInput from "../Input/ColorInput";
import MultiInput from "../Input/MultiInput";

import { BsType, BsPaintBucket, BsTrashFill } from "react-icons/bs";

type TableHighlightProps = {
  highlight: TableHighlight;
  setHighlight: (highlight: TableHighlight) => void;
  onRemoveHighlight: () => void;
};
export default function TableHighlight({
  highlight,
  setHighlight,
  onRemoveHighlight,
}: TableHighlightProps) {
  const { color, type, fields } = highlight;

  return (
    <>
      <ColorInput value={color} onChange={(color) => setHighlight({ ...highlight, color })} />

      <Button
        className="p-1"
        onClick={() => {
          setHighlight({ ...highlight, type: type === "bg" ? "fg" : "bg" });
        }}
      >
        {type === "fg" && <BsType />}
        {type === "bg" && <BsPaintBucket />}
      </Button>

      <MultiInput value={fields} onChange={(fields) => setHighlight({ ...highlight, fields })} />

      <Button className="p-1 text-red" onClick={onRemoveHighlight}>
        <BsTrashFill />
      </Button>
    </>
  );
}
