import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

import { RootState } from "../Redux/store";
import { drop, move, toggleHold, togglePause } from "../Redux/tetrisSlice";
import { useInterval } from "../Hooks/useInterval";
import { overlayPiece } from "../Helper/tetris";

import Board from "../Components/Tetris/Board";
import PausedBanner from "../Components/Tetris/PausedBanner";
import HeldPiece from "../Components/Tetris/HeldPiece";
import Controls from "../Components/Tetris/Controls";
import Queue from "../Components/Tetris/Queue";
import Score from "../Components/Tetris/Score";

export default function Tetris() {
  const { score, highScore, isPaused, board, currentPiece, heldPiece, queue } = useSelector(
    (state: RootState) => state.tetris,
  );
  const dispatch = useDispatch();

  const speed = useMemo(() => 1000 - score / 15, [score]);

  // Game loop
  useInterval(() => {
    dispatch(move("MOVE_DOWN"));
  }, speed);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          dispatch(move("MOVE_LEFT"));
          break;
        case "ArrowRight":
          dispatch(move("MOVE_RIGHT"));
          break;
        case "ArrowDown":
          dispatch(move("MOVE_DOWN"));
          break;
        case "ArrowUp":
          dispatch(move("ROTATE"));
          break;
        case " ":
          dispatch(drop());
          dispatch(move("MOVE_DOWN"));
          break;
        case "p":
          dispatch(togglePause());
          break;
        case "h":
          dispatch(toggleHold());
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-start justify-center gap-2 p-2">
      {isPaused && <PausedBanner />}

      <div className="flex flex-col gap-2">
        <HeldPiece heldPiece={heldPiece} />
        <Controls />
      </div>

      <Board board={overlayPiece(board, currentPiece).overlayedBoard} />

      <div className="flex flex-col gap-2">
        <Queue queue={queue} />

        <Score label="Score" value={score} />
        <Score label="Best" value={highScore} />
      </div>
    </div>
  );
}
