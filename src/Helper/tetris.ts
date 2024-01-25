import { pieces } from "../Config/tetris";

export function createBoard(height: number, width: number): TetrisCell[][] {
  return Array.from(Array(height), () => new Array(width).fill(""));
}

export function createPiece(type?: TetrisPieceType): TetrisPositionedPiece {
  const pieceTypes = Object.keys(pieces) as TetrisPieceType[];
  const randomPieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];

  return {
    type: type ?? randomPieceType,
    position: { x: 3, y: 0 },
    rotation: 0,
  };
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function overlayPiece(board: TetrisCell[][], piece: TetrisPositionedPiece) {
  const newBoard = deepCopy(board);

  const { type, position, rotation } = piece;
  const { shape } = pieces[type];

  let rotatedShape = deepCopy<number[][]>(shape);
  for (let i = 0; i < rotation; i++) {
    rotatedShape = deepCopy(
      rotatedShape.map((row, rowIndex) => {
        return row.map((_, cellIndex) => {
          return rotatedShape[shape.length - 1 - cellIndex][rowIndex];
        });
      }),
    );
  }

  let overlayedBoard = deepCopy(newBoard);
  let isClipping = false;
  rotatedShape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        const isOutOfBounds = y + position.y >= board.length || x + position.x >= board[0].length;
        const isOverlapping = overlayedBoard?.[y + position.y]?.[x + position.x] !== "";

        if (isOutOfBounds || isOverlapping) {
          isClipping = true;
          return;
        }
        overlayedBoard[y + position.y][x + position.x] = type;
      }
    });
  });

  return {
    isClipping,
    overlayedBoard,
  };
}

export function clearLines(board: TetrisCell[][]) {
  const newBoard = deepCopy(board);

  let linesCleared = 0;
  newBoard.forEach((row, y) => {
    if (row.every((cell) => cell !== "")) {
      newBoard.splice(y, 1);
      newBoard.unshift(new Array(board[0].length).fill(""));
      linesCleared += 1;
    }
  });

  return {
    linesCleared,
    newBoard,
  };
}
