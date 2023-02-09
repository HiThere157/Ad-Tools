import { MouseEvent, useState } from "react";

type DraggableProps = {
  children: React.ReactNode;
  title: string;
  posSize: PosSize;
  canResize?: boolean;
  onPosSizeChange: (posSize: PosSize) => any;
};
export default function Draggable({
  children,
  title,
  posSize,
  canResize = true,
  onPosSizeChange,
}: DraggableProps) {
  const [offsetStart, setOffsetStart] = useState<Position>({ x: 0, y: 0 });
  const [sizeStart, setsizeStart] = useState<Size>({ w: 0, h: 0 });

  const startDrag = (event: MouseEvent<HTMLDivElement>) => {
    setOffsetStart({
      x: event.clientX - posSize.x,
      y: event.clientY - posSize.y,
    });
    setsizeStart({ w: posSize.w, h: posSize.h });
  };

  const drag = (event: MouseEvent<HTMLDivElement>) => {
    if (!event.buttons) return;
    onPosSizeChange({
      x: event.clientX - offsetStart.x,
      y: event.clientY - offsetStart.y,
      w: posSize.w,
      h: posSize.h,
    });
  };

  const resize = (event: MouseEvent<HTMLDivElement>) => {
    if (!event.buttons || !canResize) return;
    onPosSizeChange({
      x: posSize.x,
      y: posSize.y,
      w: event.clientX - posSize.x + (sizeStart.w - offsetStart.x),
      h: event.clientY - posSize.y + (sizeStart.h - offsetStart.y),
    });
  };

  return (
    <div
      style={{
        top: posSize.y + "px",
        left: posSize.x + "px",
        width: posSize.w + "px",
        height: posSize.h + "px",
      }}
      className="border-2 rounded dark:border-elFlatBorder absolute"
    >
      {canResize && (
        <div
          className="absolute right-[-0.5rem] bottom-[-0.5rem] w-6 h-6 cursor-nwse-resize"
          onMouseDown={startDrag}
          onMouseMove={resize}
        >
          <div className="w-3 h-3 rounded-br border-b-2 border-r-2 dark:border-elFlatBorder" />
        </div>
      )}
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
