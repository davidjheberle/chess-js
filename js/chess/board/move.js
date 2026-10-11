export class Move {
  // Init.
  constructor(from, to, type) {
    this.from = from;
    this.to = to;
    this.type = type;
    this.piece = this.from.piece;
    this.target = this.to.piece;
  }

  // Equals function.
  equals(move) {
    return this.to.equals(move.to) && this.from.equals(move.from);
  }
}
