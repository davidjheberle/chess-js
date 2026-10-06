import { MoveType, PieceState } from "../enums.js";
import { app } from "../app.js";

export class Behavior {
  // Init.
  constructor(piece) {
    this.piece = piece;
    this.moves = [];
  }

  // Move to the specified square.
  moveToSquare(square) {
    const move = this.getMove(square);
    if (move != null) {
      this.performMove(move);
      this.finishMove();
    } else {
      this.moveBack();
    }
  }

  // Perform a move.
  performMove(move) {
    switch (move.type) {
      case MoveType.CASTLE:
        // Move the rook.
        move.target.behavior.positionOnSquare(move.rookTo);
        move.rookFrom.piece = null;
        break;

      default:
        if (move.target != null) {
          move.target.setPieceState(PieceState.DEAD);
        }
    }

    // Leave the previous square.
    move.from.piece = null;

    // Go to the next square.
    this.positionOnSquare(move.to);
  }

  // Finish moving.
  finishMove() {
    this.piece.player.endTurn();
  }

  // Move back to the occupied square.
  moveBack() {
    this.positionOnSquare(this.piece.square);
  }

  // Position this piece on the given square.
  positionOnSquare(square) {
    if (this.piece.square != null &&
      this.piece.square != square) {
      this.piece.moveCount++;
      this.piece.sinceMove = 0;
    }
    this.piece.pos.x = square.pos.x - this.piece.width / 2;
    this.piece.pos.y = square.pos.y - this.piece.height / 2 + this.piece.offsetY;
    this.piece.pos.z = square.row + 2;
    this.piece.square = square;
    this.piece.square.piece = this.piece;
    app.world.sort(true);
  }

  // Get move based on its 'to' square.
  getMove(toSquare) {
    return this.moves.find(function (m) {
      return m.to.equals(toSquare);
    });
  }

  // Calculate possible moves.
  calculateMoves() {
    // override
    this.moves = [];
  }

  // Prune invalid moves.
  pruneMoves() {
    const valid = [];
    this.moves.forEach(function (m, i) {
      if (m.target == null ||
        m.target.color != m.piece.color) {
        valid.push(m);
      }
    });
    this.moves = valid;
  }
}
