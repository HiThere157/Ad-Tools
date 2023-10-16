import { defaultTableHighlight } from "../../Config/default";

import Button from "../Button";
import TableHighlight from "./TableHighlight";

import { BsPlusLg } from "react-icons/bs";

type TableHighlightMenuProps = {
  highlights: TableHighlight[];
  setHighlights: (highlights: TableHighlight[]) => void;
};
export default function TableHighlightMenu({ highlights, setHighlights }: TableHighlightMenuProps) {
  return (
    <div className="rounded border-2 border-border">
      <h3 className="mx-3 mt-1 text-lg font-bold">Highlights:</h3>

      <div className="flex items-end gap-1 p-2">
        <div className="grid flex-grow grid-cols-[auto_auto_1fr_auto] items-start gap-1">
          {highlights.map((highlight, highlightIndex) => (
            <TableHighlight
              key={highlightIndex}
              highlight={highlight}
              setHighlight={(highlight) => {
                const newHighlights = [...highlights];
                newHighlights[highlightIndex] = highlight;
                setHighlights(newHighlights);
              }}
              onRemoveHighlight={() =>
                setHighlights(highlights.filter((_, i) => i !== highlightIndex))
              }
            />
          ))}
        </div>

        <Button
          className="p-1"
          onClick={() => setHighlights([...highlights, defaultTableHighlight])}
        >
          <BsPlusLg />
        </Button>
      </div>
    </div>
  );
}
