export const PieceType = {
  PAWN: 0,
  ROOK: 1,
  KNIGHT: 2,
  BISHOP: 3,
  QUEEN: 4,
  KING: 5,
};

export const PieceColor = {
  BLACK: 0,
  WHITE: 1,
};

// Piece state enum.
export const PieceState = {
  IDLE: 0,
  HELD: 1,
  DEAD: 2,
};

export const MoveType = {
  DEFAULT: 0,
  MOVE: 1,
  CAPTURE: 2,
  CASTLE: 3,
  ENPASSANT: 4,
};
