import { tableHighlight } from "../../Config/default";

import Button from "../Button";
import TableHighlight from "./TableHighlight";

import { BsPlusLg } from "react-icons/bs";

type TableHighlightMenuProps = {
  highlights: TableHighlight[];
  setHighlights: (highlights: TableHighlight[]) => void;
};
export default function TableHighlightMenu({ highlights, setHighlights }: TableHighlightMenuProps) {
  return (
    <div className="flex items-end gap-1 rounded border-2 border-border p-2">
      <div className="grid flex-grow grid-cols-[auto_1fr_auto] items-start gap-1">
        {highlights.map((highlight, highlightIndex) => (
          <TableHighlight
            key={highlightIndex}
            highlight={highlight}
            setHighlight={(highlight) => {
              const newHighlights = [...highlights];
              newHighlights[highlightIndex] = highlight;
              setHighlights(newHighlights);
            }}
            removeHighlight={() => setHighlights(highlights.filter((_, i) => i !== highlightIndex))}
          />
        ))}
      </div>

      <Button className="p-1" onClick={() => setHighlights([...highlights, tableHighlight])}>
        <BsPlusLg />
      </Button>
    </div>
  );
}
