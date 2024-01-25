type TetrisPieceType = "o" | "i" | "s" | "z" | "l" | "j" | "t";

type TetrisCell = TetrisPieceType | "";

type TetrisPiece = {
  shape: number[][];
  color: string;
};

type TetrisPositionedPiece = {
  type: TetrisPieceType;
  position: { x: number; y: number };
  rotation: number;
};

type TetrisHeldPiece = {
  type?: TetrisPieceType;
  isLocked: boolean;
};

type TetrisMoveTypes = "MOVE_LEFT" | "MOVE_RIGHT" | "MOVE_DOWN" | "ROTATE";
