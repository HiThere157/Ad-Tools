import { useEffect, useMemo, useRef } from "react";
import { useSessionStorage, useLocalStorage } from "../Hooks/useStorage";

import { BsArrowDown, BsArrowLeft, BsArrowRight, BsArrowUp } from "react-icons/bs";

type PieceTypes = "o" | "i" | "s" | "z" | "l" | "j" | "t";
type CellTypes = PieceTypes | "";
type Piece = {
  shape: number[][];
  color: string;
};

type PositionedPiece = {
  pieceType: PieceTypes;
  position: { x: number; y: number };
  rotation: 0 | 1 | 2 | 3;
};

type ActionTypes = "MOVE_LEFT" | "MOVE_RIGHT" | "MOVE_DOWN" | "ROTATE" | "DROP";

const pieces: Record<PieceTypes, Piece> = {
  o: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#f0f000",
  },
  i: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00f0f0",
  },
  s: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#00f000",
  },
  z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#f00000",
  },
  l: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#f0a000",
  },
  j: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#0000f0",
  },
  t: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#a000f0",
  },
};

const height = 20;
const width = 10;

function createBoard(): CellTypes[][] {
  return Array.from(Array(height), () => new Array(width).fill(""));
}

function newPiece(): PositionedPiece {
  const pieceTypes = Object.keys(pieces) as PieceTypes[];
  const randomPieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];

  return {
    pieceType: randomPieceType,
    position: { x: Math.floor(width / 2) - 2, y: 0 },
    rotation: 0,
  };
}

function deepCopy<T>(arr: T[][]): T[][] {
  return JSON.parse(JSON.stringify(arr));
}

function overlayPiece(board: CellTypes[][], piece: PositionedPiece) {
  const { pieceType, position, rotation } = piece;
  const { shape } = pieces[pieceType];

  // rotate 2d array clockwise 90deg n times (n = rotation)
  let rotatedShape = deepCopy(shape);
  for (let i = 0; i < rotation; i++) {
    rotatedShape = deepCopy(
      rotatedShape.map((row, y) => {
        return row.map((_, x) => {
          return rotatedShape[shape.length - 1 - x][y];
        });
      }),
    );
  }

  // overlay piece on board
  const overlayedBoard = deepCopy(board);
  let isClipping = false;
  rotatedShape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        const isOutOfBounds = y + position.y >= height || x + position.x >= width;
        const isOverlapping = overlayedBoard?.[y + position.y]?.[x + position.x] !== "";

        if (isOutOfBounds || isOverlapping) {
          isClipping = true;
          return;
        }
        overlayedBoard[y + position.y][x + position.x] = pieceType;
      }
    });
  });

  return {
    isClipping,
    overlayedBoard,
  };
}

function clearFullRows(board: CellTypes[][]) {
  const clearedBoard = deepCopy(board);
  let clearedRows = 0;

  clearedBoard.forEach((row, y) => {
    if (row.every((cell) => cell !== "")) {
      clearedBoard.splice(y, 1);
      clearedBoard.unshift(new Array(width).fill(""));
      clearedRows++;
    }
  });

  return {
    clearedBoard,
    clearedRows,
  };
}

function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const interval = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(interval);
  }, [delay]);
}

export default function Tetris() {
  const [score, setScore] = useSessionStorage<number>("tetris_score", 0);
  const [highScore, setHighScore] = useLocalStorage<number>("tetris_highScore", 0);
  const [isPaused, setIsPaused] = useSessionStorage<boolean>("tetris_isPaused", false);
  const [board, setBoard] = useSessionStorage<CellTypes[][]>("tetris_board", createBoard());
  const [currentPiece, setCurrentPiece] = useSessionStorage<PositionedPiece>(
    "tetris_currentPiece",
    newPiece(),
  );
  const [queue, setQueue] = useSessionStorage<PositionedPiece[]>(
    "tetris_queue",
    new Array(5).fill(null).map(() => newPiece()),
  );

  const overlayedBoard = useMemo(() => {
    const { isClipping, overlayedBoard } = overlayPiece(board, currentPiece);

    // If the current piece is clipping, reset the board
    if (isClipping) {
      setBoard(createBoard());
      setScore(0);
    }

    return overlayedBoard;
  }, [board, currentPiece]);

  const speed = useMemo(() => 1000 - score / 15, [score]);

  function nextPiece() {
    const newQueue = [...queue];
    const nextPiece = newQueue.shift() as PositionedPiece;

    newQueue.push(newPiece());
    setQueue(newQueue);
    setCurrentPiece(nextPiece);
  }

  function lockClearAndNext(board: CellTypes[][]) {
    const { clearedBoard, clearedRows } = clearFullRows(board);
    if (clearedRows != 0) {
      const newScore = score + (40 / 3) * 3 ** clearedRows;
      setScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
      }
    }

    setBoard(clearedBoard);
    nextPiece();
  }

  function action(type: ActionTypes) {
    if (isPaused) return;

    let newPosition = { ...currentPiece.position };
    let newRotation = currentPiece.rotation;

    switch (type) {
      case "MOVE_LEFT":
        newPosition.x--;
        break;
      case "MOVE_RIGHT":
        newPosition.x++;
        break;
      case "MOVE_DOWN":
        newPosition.y++;
        break;
      case "ROTATE":
        newRotation = ((newRotation + 1) % 4) as 0 | 1 | 2 | 3;
        break;
      case "DROP":
        // Move down until clipping
        while (!overlayPiece(board, { ...currentPiece, position: newPosition }).isClipping) {
          newPosition.y++;
        }
        // Move back up one
        newPosition.y--;
        break;
    }

    const newCurrentPiece = {
      ...currentPiece,
      position: newPosition,
      rotation: newRotation,
    };
    const { isClipping, overlayedBoard: newOverlayedBoard } = overlayPiece(board, newCurrentPiece);

    // If not clipping, move to new position
    if (!isClipping) {
      setCurrentPiece(newCurrentPiece);
    }

    if (type === "MOVE_DOWN" && isClipping) {
      // If clipping, ignore move down and lock the piece (use the unchanged overlayedBoard)
      lockClearAndNext(overlayedBoard);
    }

    if (type === "DROP") {
      // If dropping, dont check for clipping, just lock the new position (use the changed newOverlayedBoard)
      lockClearAndNext(newOverlayedBoard);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
        action("MOVE_LEFT");
        break;
      case "ArrowRight":
        action("MOVE_RIGHT");
        break;
      case "ArrowDown":
        action("MOVE_DOWN");
        break;
      case "ArrowUp":
        action("ROTATE");
        break;
      case " ":
        action("DROP");
        break;
      case "p":
        setIsPaused(!isPaused);
        break;
    }
  }

  // Game loop
  useInterval(() => {
    action("MOVE_DOWN");
  }, speed);

  // Handle key presses
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

    // because of js closures, we need to add all variables used in the callback to the dependency array
  }, [currentPiece, board, isPaused]);

  return (
    <div className="relative flex items-start justify-center gap-2 p-4">
      {isPaused && (
        <div className="absolute left-0 top-1/3 flex w-full justify-center bg-primary p-3">
          <span className="text-5xl">Paused</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2">
        <span className="text-2xl font-bold text-grey">Controls</span>

        <div className="grid grid-cols-[auto_1fr] items-center justify-items-center gap-x-2 gap-y-1">
          <kbd>
            <BsArrowDown className="text-xl" />
          </kbd>
          <span>Move Down</span>

          <kbd>
            <BsArrowLeft className="text-xl" />
          </kbd>
          <span>Move Left</span>

          <kbd>
            <BsArrowRight className="text-xl" />
          </kbd>
          <span>Move Right</span>

          <kbd>
            <BsArrowUp className="text-xl" />
          </kbd>
          <span>Rotate</span>

          <kbd>P</kbd>
          <span>Pause</span>

          <kbd>Space</kbd>
          <span>Drop</span>
        </div>
      </div>

      <div
        className="grid w-fit rounded border-2 border-border"
        style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
      >
        {overlayedBoard.flat().map((cell, i) => {
          return (
            <div
              key={i}
              className="aspect-square border border-border"
              style={{
                height: `${90 / height}vh`,
                backgroundColor: cell ? pieces[cell]?.color : "transparent",
              }}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-center rounded border-2 border-border">
          {queue.map((piece, i) => {
            return (
              <div key={i} className="mx-2 flex h-20 w-20 items-center justify-center">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${pieces[piece.pieceType].shape.length}, 1fr)`,
                  }}
                >
                  {pieces[piece.pieceType].shape
                    .filter((row) => !row.every((cell) => cell === 0))
                    .flat()
                    .map((cell, j) => {
                      return (
                        <div
                          key={j}
                          className="aspect-square h-5"
                          style={{
                            backgroundColor: cell ? pieces[piece.pieceType].color : "transparent",
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2 font-bold">
          <span className="text-2xl text-grey">Score</span>
          <span className="text-4xl">{score}</span>
        </div>

        <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2 font-bold">
          <span className="text-2xl text-grey">Best</span>
          <span className="text-4xl">{highScore}</span>
        </div>
      </div>
    </div>
  );
}
