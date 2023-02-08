import { useState } from "react";
import Draggable from "../Components/Designer/Draggable";

export default function DesignerPage() {
  const [posSize, setPosSize] = useState<PosSize>({ x: 10, y: 10, w: 100, h: 100 });

  return (
    <article>
      <Draggable title="Test" posSize={posSize} onPosSizeChange={setPosSize}>
        <div></div>
      </Draggable>
    </article>
  );
}
