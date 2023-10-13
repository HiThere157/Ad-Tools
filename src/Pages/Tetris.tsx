// import { useEffect, useMemo, useRef } from "react";
// import { useSessionStorage, useLocalStorage } from "../Hooks/useStorage";

// import { BsArrowDown, BsArrowLeft, BsArrowRight, BsArrowUp, BsLockFill } from "react-icons/bs";

// type PieceType = "o" | "i" | "s" | "z" | "l" | "j" | "t";
// type CellTypes = PieceType | "";
// type Piece = {
//   shape: number[][];
//   color: string;
// };

// type PositionedPiece = {
//   pieceType: PieceType;
//   position: { x: number; y: number };
//   rotation: 0 | 1 | 2 | 3;
// };
// type HeldPiece = {
//   pieceType?: PieceType;
//   isLocked: boolean;
// };

// type ActionTypes = "MOVE_LEFT" | "MOVE_RIGHT" | "MOVE_DOWN" | "ROTATE" | "DROP";

// const pieces: Record<PieceType, Piece> = {
//   o: {
//     shape: [
//       [1, 1],
//       [1, 1],
//     ],
//     color: "#f0f000",
//   },
//   i: {
//     shape: [
//       [0, 0, 0, 0],
//       [1, 1, 1, 1],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//     ],
//     color: "#00f0f0",
//   },
//   s: {
//     shape: [
//       [0, 1, 1],
//       [1, 1, 0],
//       [0, 0, 0],
//     ],
//     color: "#00f000",
//   },
//   z: {
//     shape: [
//       [1, 1, 0],
//       [0, 1, 1],
//       [0, 0, 0],
//     ],
//     color: "#f00000",
//   },
//   l: {
//     shape: [
//       [0, 0, 1],
//       [1, 1, 1],
//       [0, 0, 0],
//     ],
//     color: "#f0a000",
//   },
//   j: {
//     shape: [
//       [1, 0, 0],
//       [1, 1, 1],
//       [0, 0, 0],
//     ],
//     color: "#0000f0",
//   },
//   t: {
//     shape: [
//       [0, 1, 0],
//       [1, 1, 1],
//       [0, 0, 0],
//     ],
//     color: "#a000f0",
//   },
// };

// const height = 20;
// const width = 10;

// function createBoard(): CellTypes[][] {
//   return Array.from(Array(height), () => new Array(width).fill(""));
// }

// function newPiece(type?: PieceType): PositionedPiece {
//   const pieceTypes = Object.keys(pieces) as PieceType[];
//   const randomPieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];

//   return {
//     pieceType: type ?? randomPieceType,
//     position: { x: Math.floor(width / 2) - 2, y: 0 },
//     rotation: 0,
//   };
// }

// function deepCopy<T>(arr: T[][]): T[][] {
//   return JSON.parse(JSON.stringify(arr));
// }

// function overlayPiece(board: CellTypes[][], piece: PositionedPiece) {
//   const { pieceType, position, rotation } = piece;
//   const { shape } = pieces[pieceType];

//   // rotate 2d array clockwise 90deg n times (n = rotation)
//   let rotatedShape = deepCopy(shape);
//   for (let i = 0; i < rotation; i++) {
//     rotatedShape = deepCopy(
//       rotatedShape.map((row, rowIndex) => {
//         return row.map((_, cellIndex) => {
//           return rotatedShape[shape.length - 1 - cellIndex][rowIndex];
//         });
//       }),
//     );
//   }

//   // overlay piece on board
//   const overlayedBoard = deepCopy(board);
//   let isClipping = false;
//   rotatedShape.forEach((row, y) => {
//     row.forEach((cell, x) => {
//       if (cell === 1) {
//         const isOutOfBounds = y + position.y >= height || x + position.x >= width;
//         const isOverlapping = overlayedBoard?.[y + position.y]?.[x + position.x] !== "";

//         if (isOutOfBounds || isOverlapping) {
//           isClipping = true;
//           return;
//         }
//         overlayedBoard[y + position.y][x + position.x] = pieceType;
//       }
//     });
//   });

//   return {
//     isClipping,
//     overlayedBoard,
//   };
// }

// function clearFullRows(board: CellTypes[][]) {
//   const clearedBoard = deepCopy(board);
//   let clearedRows = 0;

//   clearedBoard.forEach((row, y) => {
//     if (row.every((cell) => cell !== "")) {
//       clearedBoard.splice(y, 1);
//       clearedBoard.unshift(new Array(width).fill(""));
//       clearedRows++;
//     }
//   });

//   return {
//     clearedBoard,
//     clearedRows,
//   };
// }

// function useInterval(callback: () => void, delay: number) {
//   const callbackRef = useRef(callback);

//   useEffect(() => {
//     callbackRef.current = callback;
//   }, [callback]);

//   useEffect(() => {
//     const interval = setInterval(() => callbackRef.current(), delay);
//     return () => clearInterval(interval);
//   }, [delay]);
// }

// export default function Tetris() {
//   const [score, setScore] = useSessionStorage<number>("tetris_score", 0);
//   const [highScore, setHighScore] = useLocalStorage<number>("tetris_highScore", 0);
//   const [isPaused, setIsPaused] = useSessionStorage<boolean>("tetris_isPaused", false);
//   const [board, setBoard] = useSessionStorage<CellTypes[][]>("tetris_board", createBoard());
//   const [currentPiece, setCurrentPiece] = useSessionStorage<PositionedPiece>(
//     "tetris_currentPiece",
//     newPiece(),
//   );
//   const [queue, setQueue] = useSessionStorage<PositionedPiece[]>(
//     "tetris_queue",
//     new Array(5).fill(null).map(() => newPiece()),
//   );
//   const [heldPiece, setHeldPiece] = useSessionStorage<HeldPiece>("tetris_heldPiece", {
//     isLocked: false,
//   });

//   const overlayedBoard = useMemo(() => {
//     const { isClipping, overlayedBoard } = overlayPiece(board, currentPiece);

//     // If the current piece is clipping, reset the board
//     if (isClipping) {
//       setBoard(createBoard());
//       setScore(0);
//       setHeldPiece({ isLocked: false });
//     }

//     return overlayedBoard;
//   }, [board, currentPiece]);

//   const speed = useMemo(() => 1000 - score / 15, [score]);

//   function nextPiece() {
//     const newQueue = [...queue];
//     const nextPiece = newQueue.shift() as PositionedPiece;

//     newQueue.push(newPiece());
//     setQueue(newQueue);
//     setCurrentPiece(nextPiece);
//   }

//   function lockClearAndNext(board: CellTypes[][]) {
//     const { clearedBoard, clearedRows } = clearFullRows(board);
//     if (clearedRows != 0) {
//       const newScore = score + (40 / 3) * 3 ** clearedRows;
//       setScore(newScore);

//       if (newScore > highScore) {
//         setHighScore(newScore);
//       }
//     }

//     setBoard(clearedBoard);
//     nextPiece();

//     setHeldPiece({ ...heldPiece, isLocked: false });
//   }

//   function action(type: ActionTypes) {
//     if (isPaused) return;

//     let newPosition = { ...currentPiece.position };
//     let newRotation = currentPiece.rotation;

//     switch (type) {
//       case "MOVE_LEFT":
//         newPosition.x--;
//         break;
//       case "MOVE_RIGHT":
//         newPosition.x++;
//         break;
//       case "MOVE_DOWN":
//         newPosition.y++;
//         break;
//       case "ROTATE":
//         newRotation = ((newRotation + 1) % 4) as 0 | 1 | 2 | 3;
//         break;
//       case "DROP":
//         // Move down until clipping
//         while (!overlayPiece(board, { ...currentPiece, position: newPosition }).isClipping) {
//           newPosition.y++;
//         }
//         // Move back up one
//         newPosition.y--;
//         break;
//     }

//     const newCurrentPiece = {
//       ...currentPiece,
//       position: newPosition,
//       rotation: newRotation,
//     };
//     const { isClipping, overlayedBoard: newOverlayedBoard } = overlayPiece(board, newCurrentPiece);

//     // If not clipping, move to new position
//     if (!isClipping) {
//       setCurrentPiece(newCurrentPiece);
//     }

//     if (type === "MOVE_DOWN" && isClipping) {
//       // If clipping, ignore move down and lock the piece (use the unchanged overlayedBoard)
//       lockClearAndNext(overlayedBoard);
//     }

//     if (type === "DROP") {
//       // If dropping, dont check for clipping, just lock the new position (use the changed newOverlayedBoard)
//       lockClearAndNext(newOverlayedBoard);
//     }
//   }

//   function handleKeyDown(e: KeyboardEvent) {
//     switch (e.key) {
//       case "ArrowLeft":
//         action("MOVE_LEFT");
//         break;
//       case "ArrowRight":
//         action("MOVE_RIGHT");
//         break;
//       case "ArrowDown":
//         action("MOVE_DOWN");
//         break;
//       case "ArrowUp":
//         action("ROTATE");
//         break;
//       case " ":
//         action("DROP");
//         break;
//       case "p":
//         setIsPaused(!isPaused);
//         break;
//       case "h":
//         if (heldPiece.isLocked) break;

//         // Hold the current piece
//         setHeldPiece({ pieceType: currentPiece.pieceType, isLocked: true });

//         // If there is a held piece, swap it with the current piece
//         if (heldPiece.pieceType) {
//           setCurrentPiece(newPiece(heldPiece.pieceType));
//         } else {
//           nextPiece();
//         }
//         break;
//     }
//   }

//   // Game loop
//   useInterval(() => {
//     action("MOVE_DOWN");
//   }, speed);

//   // Handle key presses
//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);

//     // because of js closures, we need to add all variables used in the callback to the dependency array
//   }, [currentPiece, board, isPaused]);

//   return (
//     <div className="relative flex items-start justify-center gap-2 p-2">
//       {isPaused && <PausedBanner />}

//       <div className="flex flex-col gap-2">
//         <HeldPiece heldPiece={heldPiece} />
//         <Controls />
//       </div>

//       <Board board={overlayedBoard} />

//       <div className="flex flex-col gap-2">
//         <Queue queue={queue} />

//         <Score label="Score" value={score} />
//         <Score label="Best" value={highScore} />
//       </div>
//     </div>
//   );
// }

// function PausedBanner() {
//   return (
//     <div className="absolute left-0 top-1/3 flex w-full justify-center bg-primary p-3">
//       <span className="text-5xl">Paused</span>
//     </div>
//   );
// }

// type HeldPieceProps = {
//   heldPiece: HeldPiece;
// };
// function HeldPiece({ heldPiece }: HeldPieceProps) {
//   const { pieceType, isLocked } = heldPiece;
//   const piece = pieceType ? pieces[pieceType] : null;

//   return (
//     <div className="relative flex flex-col items-center gap-1 rounded border-2 border-border px-4 py-2">
//       <span className="text-2xl font-bold text-grey">Hold</span>

//       {isLocked && <BsLockFill className="absolute bottom-2 right-2 text-2xl text-grey" />}

//       <div className="mx-2 flex aspect-square h-[9vh] items-center justify-center">
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: `repeat(${piece?.shape.length}, 1fr)`,
//           }}
//         >
//           {piece?.shape
//             .filter((row) => !row.every((cell) => cell === 0))
//             .flat()
//             .map((cell, cellIndex) => (
//               <div
//                 key={cellIndex}
//                 className="aspect-square h-[2.25vh]"
//                 style={{
//                   backgroundColor: cell ? piece.color : "transparent",
//                 }}
//               />
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Controls() {
//   return (
//     <div className="flex flex-col items-center gap-2 rounded border-2 border-border p-2">
//       <span className="text-2xl font-bold text-grey">Controls</span>

//       <div className="grid grid-cols-[auto_1fr] items-center justify-items-center gap-x-2 gap-y-1">
//         <kbd>
//           <BsArrowDown className="text-xl" />
//         </kbd>
//         <span>Move Down</span>

//         <kbd>
//           <BsArrowLeft className="text-xl" />
//         </kbd>
//         <span>Move Left</span>

//         <kbd>
//           <BsArrowRight className="text-xl" />
//         </kbd>
//         <span>Move Right</span>

//         <kbd>
//           <BsArrowUp className="text-xl" />
//         </kbd>
//         <span>Rotate</span>

//         <kbd>H</kbd>
//         <span>Hold</span>

//         <kbd>P</kbd>
//         <span>Pause</span>

//         <kbd>Space</kbd>
//         <span>Drop</span>
//       </div>
//     </div>
//   );
// }

// type BoardProps = {
//   board: CellTypes[][];
// };
// function Board({ board }: BoardProps) {
//   return (
//     <div
//       className="grid w-fit rounded border-2 border-border"
//       style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
//     >
//       {board.flat().map((cell, cellIndex) => (
//         <div
//           key={cellIndex}
//           className="aspect-square border border-border"
//           style={{
//             height: `${90 / height}vh`,
//             backgroundColor: cell ? pieces[cell]?.color : "transparent",
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// type QueueProps = {
//   queue: PositionedPiece[];
// };
// function Queue({ queue }: QueueProps) {
//   const queuedPieces = queue.map((piece) => pieces[piece.pieceType]);

//   return (
//     <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2">
//       <span className="text-2xl font-bold text-grey">Queue</span>

//       <div className="flex flex-col items-center">
//         {queuedPieces.map((piece, pieceIndex) => (
//           <div
//             key={pieceIndex}
//             className="mx-2 flex aspect-square h-[9vh] items-center justify-center"
//           >
//             <div
//               className="grid"
//               style={{
//                 gridTemplateColumns: `repeat(${piece.shape.length}, 1fr)`,
//               }}
//             >
//               {piece.shape
//                 .filter((row) => !row.every((cell) => cell === 0))
//                 .flat()
//                 .map((cell, cellIndex) => (
//                   <div
//                     key={cellIndex}
//                     className="aspect-square h-[2.25vh]"
//                     style={{
//                       backgroundColor: cell ? piece.color : "transparent",
//                     }}
//                   />
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// type ScoreProps = {
//   label: string;
//   value: number;
// };
// function Score({ label, value }: ScoreProps) {
//   return (
//     <div className="flex flex-col items-center gap-1 rounded border-2 border-border p-2 font-bold">
//       <span className="text-2xl text-grey">{label}</span>
//       <span className="text-4xl">{value}</span>
//     </div>
//   );
// }
