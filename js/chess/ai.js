// A computer opponent: an alpha-beta search over the board's legal moves,
// scoring positions by material and where the pieces stand.

import { MoveType, PieceColor, PieceType } from "./enums.js";

const { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } = PieceType;

// How each difficulty plays: how many moves ahead it looks, and how much
// random noise (in hundredths of a pawn) blurs its judgement of each move.
export const Difficulty = {
  EASY: { name: "easy", depth: 1, noise: 150 },
  MEDIUM: { name: "medium", depth: 2, noise: 30 },
  HARD: { name: "hard", depth: 3, noise: 0 },
};

// What each piece is worth in hundredths of a pawn, indexed by PieceType.
const VALUES = [100, 500, 320, 330, 900, 0];

// Bigger than any material score: a checkmate.
const MATE = 100000;

// How many captures in a row are followed once the search depth runs out,
// so it doesn't stop in the middle of an exchange.
const QUIESCENCE_DEPTH = 4;

// Bonuses for a white piece on each square, row 0 being the 8th rank (black
// pieces use the rows flipped). From the "Simplified Evaluation Function":
// https://www.chessprogramming.org/Simplified_Evaluation_Function
const TABLES = {
  [PAWN]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [KNIGHT]: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  [BISHOP]: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  [ROOK]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  [QUEEN]: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  // The king hides behind its pawns until the endgame.
  [KING]: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

// In the endgame the king heads for the center.
const KING_ENDGAME = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50],
];

// The endgame starts once the pieces other than pawns and kings are worth
// no more than this, both sides together.
const ENDGAME_MATERIAL = 1300;

// Score the position for the turn owner: positive if they're ahead.
export function evaluate(board) {
  const pieces = board
    .getPieces(PieceColor.WHITE)
    .concat(board.getPieces(PieceColor.BLACK));
  const officers = pieces
    .filter((p) => p.type !== PAWN)
    .reduce((sum, p) => sum + VALUES[p.type], 0);
  const endgame = officers <= ENDGAME_MATERIAL;

  let score = 0;
  for (const p of pieces) {
    const white = p.isColor(PieceColor.WHITE);
    const table = p.type === KING && endgame ? KING_ENDGAME : TABLES[p.type];
    const row = white ? p.square.row : 7 - p.square.row;
    const value = VALUES[p.type] + table[row][p.square.column];
    score += white ? value : -value;
  }
  return board.turnOwner === PieceColor.WHITE ? score : -score;
}

// The turn owner's legal moves.
function legalMoves(board) {
  return board.getPieces(board.turnOwner).flatMap((p) => p.behavior.moves);
}

// True if the move takes a piece.
function isCapture(move) {
  return move.target != null && move.type !== MoveType.CASTLE;
}

// True if the move takes a pawn to the last rank.
function isPromotion(move) {
  return move.piece.type === PAWN && move.to.isOnRank(8, move.piece.color);
}

// A guess at how good the move is, so the best ones are searched first and
// more of the rest can be skipped: promotions, then taking the most
// valuable piece with the least valuable one.
function moveOrder(move) {
  let order = 0;
  if (isPromotion(move)) {
    order += VALUES[QUEEN];
  }
  if (isCapture(move)) {
    order += VALUES[move.target.type] * 10 - VALUES[move.piece.type];
  }
  return order;
}

function sortMoves(moves) {
  return moves.sort((a, b) => moveOrder(b) - moveOrder(a));
}

// The board after the given legal move, with the other player's moves
// worked out. Pawns are always promoted to queens.
export function afterMove(board, move) {
  const next = board.clone();
  // The move is already known to be legal, so the cheaper possible moves
  // are enough to play it.
  next.calculatePossibleMoves();
  const piece = next.getSquare(move.from.row, move.from.column).piece;
  piece.behavior.moveToSquare(next.getSquare(move.to.row, move.to.column));
  if (next.isPromotingPawn()) {
    next.finishPawnPromotion(QUEEN);
  }
  return next;
}

// Score the position for the turn owner by looking depth moves ahead,
// ignoring moves that score below alpha or at least beta. ply is how many
// moves have been played since the search began, so nearer mates score
// higher.
function search(board, depth, alpha, beta, ply) {
  const moves = legalMoves(board);
  if (moves.length === 0) {
    return board.isInCheck(board.turnOwner) ? -MATE + ply : 0;
  }
  if (board.hasInsufficientMaterial()) {
    return 0;
  }
  if (depth === 0) {
    return quiesce(board, moves, alpha, beta, QUIESCENCE_DEPTH);
  }
  for (const move of sortMoves(moves)) {
    const score = -search(
      afterMove(board, move),
      depth - 1,
      -beta,
      -alpha,
      ply + 1,
    );
    if (score >= beta) {
      return score;
    }
    alpha = Math.max(alpha, score);
  }
  return alpha;
}

// Score the position once the planned depth is reached, following captures
// and promotions until the position is quiet. The turn owner can always
// decline to capture, so the score is at least the current evaluation.
function quiesce(board, moves, alpha, beta, depth) {
  if (moves.length === 0) {
    return board.isInCheck(board.turnOwner) ? -MATE : 0;
  }
  const standPat = evaluate(board);
  if (depth === 0 || standPat >= beta) {
    return standPat;
  }
  alpha = Math.max(alpha, standPat);
  const forcing = moves.filter((m) => isCapture(m) || isPromotion(m));
  for (const move of sortMoves(forcing)) {
    const next = afterMove(board, move);
    const score = -quiesce(next, legalMoves(next), -beta, -alpha, depth - 1);
    if (score >= beta) {
      return score;
    }
    alpha = Math.max(alpha, score);
  }
  return alpha;
}

// Choose the turn owner's move at the given difficulty. positions are the
// keys of the positions reached so far: going back to one of them heads
// for a draw by repetition, so it scores as a draw, which the computer
// avoids when it's ahead and looks for when it's behind. Return the move's squares as
// { from: { row, column }, to: { row, column } }, or null if there's no
// legal move.
export function chooseMove(
  board,
  difficulty,
  positions = [],
  random = Math.random,
) {
  let best = null;
  let bestScore = -Infinity;
  for (const move of sortMoves(legalMoves(board))) {
    const next = afterMove(board, move);
    const key = next.positions.at(-1);
    let score;
    if (positions.includes(key)) {
      score = 0;
    } else {
      // A move scoring below this couldn't win even with the most noise, so
      // its exact score isn't needed.
      const alpha = Math.max(-MATE, bestScore - difficulty.noise);
      score = -search(next, difficulty.depth - 1, -MATE, -alpha, 1);
    }
    score += random() * difficulty.noise;
    if (score > bestScore) {
      best = move;
      bestScore = score;
    }
  }
  if (best == null) {
    return null;
  }
  return {
    from: { row: best.from.row, column: best.from.column },
    to: { row: best.to.row, column: best.to.column },
  };
}
