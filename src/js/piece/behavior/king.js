import Behavior from "js/piece/behavior.js";
import Castle from "js/board/move/castle.js";
import Default from "js/board/move/default.js";
import { MoveType, PieceType } from "js/enums.js";

var King = Behavior.extend({

  // Init.
  init: function (piece) {
    this._super(Behavior, "init", [
      piece
    ]);
  },

  // Caculate possible moves.
  calculateMoves: function () {
    var targetSquare;
    var rookFromSquare;
    var rookToSquare;
    var board = this.piece.player.board;
    this.moves = [];

    // right
    targetSquare = this.getAdjacentSquare(1, 0);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }
    // left
    targetSquare = this.getAdjacentSquare(-1, 0);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }
    // up
    targetSquare = this.getAdjacentSquare(0, -1);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }
    // down
    targetSquare = this.getAdjacentSquare(0, 1);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }

    // up left
    targetSquare = this.getAdjacentSquare(-1, -1);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }
    // down left
    targetSquare = this.getAdjacentSquare(-1, 1);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }
    // up right
    targetSquare = this.getAdjacentSquare(1, -1);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }
    // down right
    targetSquare = this.getAdjacentSquare(1, 1);
    if (targetSquare != null) {
      this.moves.push(new Default(this.piece.square, targetSquare));
    }

    // castle to column 0
    targetSquare = board.getSquare(this.piece.square.row, this.piece.square.column - 2);
    rookFromSquare = board.getSquare(this.piece.square.row, 0);
    rookToSquare = board.getSquare(this.piece.square.row, this.piece.square.column - 1);
    if (targetSquare != null &&
      rookFromSquare != null &&
      rookToSquare != null) {
      this.moves.push(new Castle(this.piece.square, targetSquare, rookFromSquare, rookToSquare));
    }
    // castle to column 7
    targetSquare = board.getSquare(this.piece.square.row, this.piece.square.column + 2);
    rookFromSquare = board.getSquare(this.piece.square.row, 7);
    rookToSquare = board.getSquare(this.piece.square.row, this.piece.square.column + 1);
    if (targetSquare != null &&
      rookFromSquare != null &&
      rookToSquare != null) {
      this.moves.push(new Castle(this.piece.square, targetSquare, rookFromSquare, rookToSquare));
    }
  },

  // Prune invalid moves.
  pruneMoves: function () {
    var valid = [];
    var board = this.piece.player.board;
    this.moves.forEach(function (m, i) {
      switch (m.type) {
        case MoveType.CASTLE:
          var result = false;
          if (m.piece.moveCount != 0) { result = true; }
          else if (m.target == null) { result = true; }
          else if (m.target.color != m.piece.color) { result = true; }
          else if (m.target.type != PieceType.ROOK) { result = true; }
          else if (m.target.moveCount != 0) { result = true; }
          else if (m.from.isThreatened(m.piece.color)) { result = true; }

          var checkDirection;
          if (!result) {
            if (m.rookFrom.column == 7) {
              checkDirection = 1;
            } else if (m.rookFrom.column == 0) {
              checkDirection = -1;
            } else {
              console.error("column is " + m.rookFrom.column + ", it must be 7 or 0.");
              result = true;
            }
          }

          if (!result) {
            // Check if any of the squares between the rook and the king are:
            // 1. Occupied.
            // 2. Threatened.
            var checkColumn = m.piece.square.column;
            var checkRow = m.piece.square.row;
            var checkSquare;
            checkColumn += checkDirection;
            while (checkColumn != m.rookFrom.column) {
              checkSquare = board.getSquare(checkRow, checkColumn);
              // Check occupied.
              if (checkSquare.isOccupied()) {
                result = true;
                break;
              }
              // Check threatened.
              if (checkSquare.isThreatened(m.piece.color)) {
                result = true;
                break;
              }
              checkColumn += checkDirection;
            }
          }

          if (!result) {
            valid.push(m);
          }
          break;

        default:
          if (!m.to.isThreatened(m.piece.color)
            && (m.target == null || m.target.color != m.piece.color)) {
            valid.push(m);
          }
          break;
      }
    });
    this.moves = valid;
  },

  // Return array of adjacent squares.
  getAdjacentSquare: function (horizontal, vertical) {
    if (Math.abs(horizontal) > 1 || Math.abs(vertical) > 1) {
      return null;
    }
    var r = this.piece.square.row + vertical;
    var c = this.piece.square.column + horizontal;
    var adjacentSquare = this.piece.player.board.getSquare(r, c);
    if (adjacentSquare == null) {
      return null;
    }
    if (adjacentSquare.isOccupied()) {
      if (adjacentSquare.piece.color != this.piece.color) {
        return adjacentSquare;
      }
    } else {
      return adjacentSquare;
    }
    return null;
  }
});

export default King;
