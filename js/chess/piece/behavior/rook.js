import { DefaultMove } from "../../board/move/default.js";
import { Behavior } from "../behavior.js";

export class RookBehavior extends Behavior {
  // Calculate possible moves.
  calculateMoves() {
    var straightSquares;
    this.moves = [];

    // right
    straightSquares = this.getStraightSquares(1, 0);
    for (let i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, straightSquares[i]));
    }
    // left
    straightSquares = this.getStraightSquares(-1, 0);
    for (let i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, straightSquares[i]));
    }
    // up
    straightSquares = this.getStraightSquares(0, -1);
    for (let i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, straightSquares[i]));
    }
    // down
    straightSquares = this.getStraightSquares(0, 1);
    for (let i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, straightSquares[i]));
    }
  }

  // Return array of horizontal and vertical squares.
  getStraightSquares(horizontal, vertical) {
    if (
      !(Math.abs(horizontal) === 1 && vertical === 0) &&
      !(Math.abs(vertical) === 1 && horizontal === 0)
    ) {
      return [];
    }
    var straightSquares = [];
    var r = this.piece.square.row;
    var c = this.piece.square.column;
    var workSquare;
    while (true) {
      r += vertical;
      c += horizontal;
      workSquare = this.piece.board.getSquare(r, c);
      if (workSquare == null) {
        break;
      }
      straightSquares.push(workSquare);
      if (workSquare.isOccupied()) {
        break;
      }
    }
    return straightSquares;
  }
}
