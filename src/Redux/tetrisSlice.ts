/* eslint-disable  @typescript-eslint/no-non-null-assertion */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { lineBonus } from "../Config/tetris";
import { clearLines, createBoard, createPiece, deepCopy, overlayPiece } from "../Helper/tetris";

const tetrisSlice = createSlice({
  name: "tetris",
  initialState: {
    score: 0,
    highScore: 0,
    isPaused: false,
    board: createBoard(20, 10),
    currentPiece: createPiece(),
    heldPiece: { isLocked: false } as TetrisHeldPiece,
    queue: new Array(5).fill(null).map(() => createPiece()),
  },
  reducers: {
    move(state, action: PayloadAction<TetrisMoveTypes>) {
      if (state.isPaused) return;

      const { currentPiece, board } = state;
      const { overlayedBoard } = overlayPiece(board, currentPiece);

      // Move the piece based on the action
      const newPiece = deepCopy(currentPiece);
      switch (action.payload) {
        case "MOVE_LEFT":
          newPiece.position.x -= 1;
          break;
        case "MOVE_RIGHT":
          newPiece.position.x += 1;
          break;
        case "MOVE_DOWN":
          newPiece.position.y += 1;
          break;
        case "ROTATE":
          newPiece.rotation = (currentPiece.rotation + 1) % 4;
          break;
      }

      // Check if the new piece is clipping after the move
      const { isClipping } = overlayPiece(board, newPiece);

      // If not clipping, update the current piece to the new piece
      if (!isClipping) {
        state.currentPiece = newPiece;
      }

      // If clipping and moving down, use the overlayed board before the move to lock the piece
      if (isClipping && action.payload === "MOVE_DOWN") {
        const { linesCleared, newBoard } = clearLines(overlayedBoard);
        state.score += lineBonus[linesCleared];
        state.board = newBoard;

        // If the next piece is clipping, game over
        // Otherwise, update the current piece to the next piece, and spawn a new piece
        const nextPiece = state.queue.shift()!;
        if (overlayPiece(newBoard, nextPiece).isClipping) {
          // Update the high score if the current score is higher
          if (state.score > state.highScore) {
            state.highScore = state.score;
          }

          state.score = 0;
          state.board = createBoard(20, 10);
          state.currentPiece = createPiece();
          state.queue = new Array(5).fill(null).map(() => createPiece());
          state.heldPiece = { isLocked: false } as TetrisHeldPiece;
        } else {
          state.currentPiece = nextPiece;
          state.queue.push(createPiece());
          state.heldPiece.isLocked = false;
        }
      }
    },
    drop(state) {
      if (state.isPaused) return;

      const { currentPiece, board } = state;

      // Drop the piece as far as possible
      const newPiece = deepCopy(currentPiece);
      while (!overlayPiece(board, newPiece).isClipping) {
        newPiece.position.y += 1;
      }
      newPiece.position.y -= 1;

      state.currentPiece = newPiece;
    },
    togglePause(state) {
      state.isPaused = !state.isPaused;
    },
    toggleHold(state) {
      if (state.heldPiece.isLocked) return;
      if (state.isPaused) return;

      const { heldPiece, currentPiece } = state;

      // If there is a held piece, swap the current piece with the held piece
      // Otherwise, set the held piece to the current piece, and spawn a new piece
      if (heldPiece.type) {
        state.currentPiece = createPiece(heldPiece.type);
      } else {
        state.currentPiece = state.queue.shift()!;
        state.queue.push(createPiece());
      }

      state.heldPiece.type = currentPiece.type;
      state.heldPiece.isLocked = true;
    },
  },
});

export const { move, drop, togglePause, toggleHold } = tetrisSlice.actions;
export default tetrisSlice.reducer;
