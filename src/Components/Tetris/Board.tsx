import { pieces } from "../../Config/tetris";

type BoardProps = {
  board: TetrisCell[][];
};
export default function Board({ board }: BoardProps) {
  return (
    <div
      className="grid rounded border-2 border-border"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}
    >
      {board.flat().map((cell, cellIndex) => (
        <div
          key={cellIndex}
          className="aspect-square border border-border"
          style={{
            height: `${90 / board.length}vh`,
            backgroundColor: cell ? pieces[cell]?.color : "transparent",
          }}
        />
      ))}
    </div>
  );
}
