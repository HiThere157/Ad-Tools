import { pieces } from "../../Config/tetris";

type QueueProps = {
  queue: TetrisPositionedPiece[];
};
export default function Queue({ queue }: QueueProps) {
  const queuedPieces = queue.map((piece) => pieces[piece.type]);

  return (
    <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2">
      <span className="text-2xl font-bold text-grey">Queue</span>

      <div className="flex flex-col items-center">
        {queuedPieces.map((piece, pieceIndex) => (
          <div
            key={pieceIndex}
            className="mx-2 flex aspect-square h-[9vh] items-center justify-center"
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${piece.shape.length}, 1fr)`,
              }}
            >
              {piece.shape
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
        ))}
      </div>
    </div>
  );
}
