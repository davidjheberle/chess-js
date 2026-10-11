// Helpers for tests: refer to squares by their algebraic name ("e2").

const FILES = "abcdefgh";

// Get the square with the given name, e.g. "e2".
export function at(board, name) {
  const column = FILES.indexOf(name[0]);
  const rank = Number(name[1]);
  return board.getSquare(8 - rank, column);
}

// Name of a square, e.g. "e2".
export function nameOf(square) {
  return FILES[square.column] + (8 - square.row);
}

// Play moves written as "e2e4"; fail if any of them isn't allowed.
export function play(board, ...moves) {
  for (const m of moves) {
    if (!board.move(at(board, m.slice(0, 2)), at(board, m.slice(2, 4)))) {
      throw new Error(`move ${m} was not allowed`);
    }
  }
}

// Sorted names of the squares the piece on the given square can move to.
export function targets(board, name) {
  return at(board, name)
    .piece.behavior.moves.map((m) => nameOf(m.to))
    .sort();
}

// Number of moves the turn owner can make.
export function moveCount(board) {
  let count = 0;
  for (const row of board.squares) {
    for (const square of row) {
      if (square.piece?.isColor(board.turnOwner)) {
        count += square.piece.behavior.moves.length;
      }
    }
  }
  return count;
}
