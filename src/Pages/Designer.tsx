import { useState } from "react";
import Draggable from "../Components/Designer/Draggable";

export default function DesignerPage() {
  const [pos, setPos] = useState<Position>({ x: 10, y: 10 });
  const [size, setSize] = useState<Size>({ w: 100, h: 100 });

  return (
    <article>
      <Draggable title="Test" position={pos} size={size} onMove={setPos} onResize={setSize}>
        <div></div>
      </Draggable>
    </article>
  );
}
