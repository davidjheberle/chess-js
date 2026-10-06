import { Behavior } from "../behavior.js";
import { DefaultMove } from "../../board/move/default.js";

export class BishopBehavior extends Behavior {
  // Caculate possible moves.
  calculateMoves() {
    var diagonalSquares;
    this.moves = [];

    // up left
    diagonalSquares = this.getDiagonalSquares(-1, -1);
    for (let i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, diagonalSquares[i]));
    }
    // down left
    diagonalSquares = this.getDiagonalSquares(-1, 1);
    for (let i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, diagonalSquares[i]));
    }
    // up right
    diagonalSquares = this.getDiagonalSquares(1, -1);
    for (let i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, diagonalSquares[i]));
    }
    // down right
    diagonalSquares = this.getDiagonalSquares(1, 1);
    for (let i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new DefaultMove(this.piece.square, diagonalSquares[i]));
    }
  }

  // Return array of diagonal squares.
  getDiagonalSquares(horizontal, vertical) {
    if (Math.abs(horizontal) != 1 && Math.abs(vertical) != 1) {
      return [];
    }
    var diagonalSquares = [];
    var r = this.piece.square.row;
    var c = this.piece.square.column;
    var workSquare;
    while (1) {
      r += vertical;
      c += horizontal;
      workSquare = this.piece.player.board.getSquare(r, c);
      if (workSquare == null) {
        break;
      }
      diagonalSquares.push(workSquare);
      if (workSquare.isOccupied()) {
        break;
      }
    }
    return diagonalSquares;
  }
}
