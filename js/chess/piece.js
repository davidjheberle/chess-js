import { PieceType } from "./enums.js";
import { BishopBehavior } from "./piece/behavior/bishop.js";
import { KingBehavior } from "./piece/behavior/king.js";
import { KnightBehavior } from "./piece/behavior/knight.js";
import { PawnBehavior } from "./piece/behavior/pawn.js";
import { QueenBehavior } from "./piece/behavior/queen.js";
import { RookBehavior } from "./piece/behavior/rook.js";

export class Piece {
  // Init.
  constructor(board, pieceType, pieceColor) {
    this.board = board;
    this.square = null;
    this.moveCount = 0;
    this.captured = false;
    this.setTypeAndColor(pieceType, pieceColor);
  }

  // Set this piece type and color.
  setTypeAndColor(type, color) {
    this.type = type;
    this.color = color;
    this.setBehavior(type);
  }

  // Set the behavior of the piece.
  setBehavior(type) {
    switch (type) {
      case PieceType.PAWN:
        this.behavior = new PawnBehavior(this);
        break;

      case PieceType.ROOK:
        this.behavior = new RookBehavior(this);
        break;

      case PieceType.KNIGHT:
        this.behavior = new KnightBehavior(this);
        break;

      case PieceType.BISHOP:
        this.behavior = new BishopBehavior(this);
        break;

      case PieceType.QUEEN:
        this.behavior = new QueenBehavior(this);
        break;

      case PieceType.KING:
        this.behavior = new KingBehavior(this);
        break;
    }
  }

  // True if the piece has been captured.
  isDead() {
    return this.captured;
  }

  // True if the piece color is equal to the given color.
  isColor(color) {
    return this.color === color;
  }

  // True if the piece's move count is granther than 0.
  hasMoved() {
    return this.moveCount > 0;
  }
}
