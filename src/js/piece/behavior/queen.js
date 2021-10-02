import Behavior from "js/piece/behavior.js";
import Default from "js/board/move/default.js";

var Queen = Behavior.extend({
  
  // Init.
  init: function (piece) {
    this._super(Behavior, "init", [
      piece
    ]);
  },

  // Calculate possible moves.
  calculateMoves: function () {
    var straightSquares;
    var diagonalSquares;
    this.moves = [];

    // right
    straightSquares = this.getStraightSquares(1, 0);
    for (var i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, straightSquares[i]));
    }
    // left
    straightSquares = this.getStraightSquares(-1, 0);
    for (var i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, straightSquares[i]));
    }
    // up
    straightSquares = this.getStraightSquares(0, -1);
    for (var i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, straightSquares[i]));
    }
    // down
    straightSquares = this.getStraightSquares(0, 1);
    for (var i = 0; i < straightSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, straightSquares[i]));
    }

    // up left
    diagonalSquares = this.getDiagonalSquares(-1, -1);
    for (var i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, diagonalSquares[i]));
    }
    // down left
    diagonalSquares = this.getDiagonalSquares(-1, 1);
    for (var i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, diagonalSquares[i]));
    }
    // up right
    diagonalSquares = this.getDiagonalSquares(1, -1);
    for (var i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, diagonalSquares[i]));
    }
    // down right
    diagonalSquares = this.getDiagonalSquares(1, 1);
    for (var i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new Default(this.piece.square, diagonalSquares[i]));
    }
  },

  // Return array of horizontal and vertical squares.
  getStraightSquares: function (horizontal, vertical) {
    if (!(Math.abs(horizontal) == 1 && vertical == 0) &&
      !(Math.abs(vertical) == 1 && horizontal == 0)) {
      return [];
    }
    var straightSquares = [];
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
      straightSquares.push(workSquare);
      if (workSquare.isOccupied()) {
        break;
      }
    }
    return straightSquares;
  },

  // Return array of diagonal squares.
  getDiagonalSquares: function (horizontal, vertical) {
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
});

export default Queen;
