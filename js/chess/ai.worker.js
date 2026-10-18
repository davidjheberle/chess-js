// Chooses the computer's moves off the main thread, so the game keeps
// drawing while it thinks. Takes { board, difficulty, positions } with the
// board as a snapshot, and answers with the chosen move.
import { chooseMove } from "./ai.js";
import { Board } from "./board.js";

self.onmessage = ({ data }) => {
  const board = Board.fromSnapshot(data.board);
  board.calculateMoves();
  self.postMessage(chooseMove(board, data.difficulty, data.positions));
};
