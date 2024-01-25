import { pieces } from "../../Config/tetris";

import { BsLockFill } from "react-icons/bs";

type HeldPieceProps = {
  heldPiece: TetrisHeldPiece;
};
export default function HeldPiece({ heldPiece }: HeldPieceProps) {
  const { type, isLocked } = heldPiece;
  const piece = type ? pieces[type] : null;

  return (
    <div className="relative flex flex-col items-center gap-1 rounded border-2 border-border px-4 py-2">
      <span className="text-2xl font-bold text-grey">Hold</span>

      {isLocked && <BsLockFill className="absolute bottom-2 right-2 text-2xl text-grey" />}

      <div className="mx-2 flex aspect-square h-[9vh] items-center justify-center">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${piece?.shape.length}, 1fr)`,
          }}
        >
          {piece?.shape
            .filter((row) => !row.every((cell) => cell === 0))
            .flat()
            .map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="aspect-square h-[2.25vh]"
                style={{
                  backgroundColor: cell ? piece.color : "transparent",
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
