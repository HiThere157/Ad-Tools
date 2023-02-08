import { MouseEvent, useState } from "react";

type DraggableProps = {
  children: React.ReactNode;
  title: string;
  position: Position;
  size: Size;
  canMove?: boolean;
  canResize?: boolean;
  onMove: (newPosition: Position) => any;
  onResize: (newSize: Size) => any;
};
export default function Draggable({
  children,
  title,
  position,
  size,
  canMove = true,
  canResize = true,
  onMove,
  onResize,
}: DraggableProps) {
  const [offsetStart, setOffsetStart] = useState<Position>({ x: 0, y: 0 });
  const [sizeStart, setsizeStart] = useState<Size>({ w: 0, h: 0 });

  const startDrag = (event: MouseEvent<HTMLDivElement>) => {
    setOffsetStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
    setsizeStart({ ...size });
  };

  const drag = (event: MouseEvent<HTMLDivElement>) => {
    if (!event.buttons) return;
    onMove({
      x: event.clientX - offsetStart.x,
      y: event.clientY - offsetStart.y,
    });
  };

  const resize = (event: MouseEvent<HTMLDivElement>) => {
    if (!event.buttons) return;
    onResize({
      w: event.clientX - position.x + (sizeStart.w - offsetStart.x),
      h: event.clientY - position.y + (sizeStart.h - offsetStart.y),
    });
  };

  return (
    <div
      style={{
        top: position.y,
        left: position.x,
        width: size.w + "px",
        height: size.h + "px",
      }}
      className="border-2 rounded dark:border-elFlatBorder  absolute"
    >
      <div
        className="absolute right-[-0.5rem] bottom-[-0.5rem] w-6 h-6 cursor-nwse-resize"
        onMouseDown={startDrag}
        onMouseMove={resize}
      >
        <div className="w-3 h-3 rounded border-b-2 border-r-2 dark:border-elFlatBorder"/>
      </div>
      <div
        className="px-2 dark:bg-elBg dark:border-elFlatBorder border-b-2 cursor-move select-none"
        onMouseDown={startDrag}
        onMouseMove={drag}
      >
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
