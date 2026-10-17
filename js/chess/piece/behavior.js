import { MoveType } from "../enums.js";

export class Behavior {
  // Init.
  constructor(piece) {
    this.piece = piece;
    this.moves = [];
  }

  // Move to the specified square. Return false if the move isn't allowed.
  moveToSquare(square) {
    const move = this.getMove(square);
    if (move == null) {
      return false;
    }
    this.performMove(move);
    this.piece.board.recordMove(move);
    this.finishMove();
    return true;
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
          this.piece.board.capture(move.target);
        }
    }

    // Leave the previous square.
    move.from.piece = null;

    // Go to the next square.
    this.positionOnSquare(move.to);
  }

  // Finish moving.
  finishMove() {
    this.piece.board.endTurn();
  }

  // Position this piece on the given square.
  positionOnSquare(square) {
    if (this.piece.square != null && this.piece.square !== square) {
      this.piece.moveCount++;
    }
    this.piece.square = square;
    this.piece.square.piece = this.piece;
  }

  // Get move based on its 'to' square.
  getMove(toSquare) {
    return this.moves.find((m) => m.to.equals(toSquare));
  }

  // Calculate possible moves.
  calculateMoves() {
    // override
    this.moves = [];
  }

  // Prune invalid moves.
  pruneMoves() {
    const valid = [];
    this.moves.forEach((m) => {
      if (m.target == null || m.target.color !== m.piece.color) {
        valid.push(m);
      }
    });
    this.moves = valid;
  }
}
