import { MoveType } from "../../enums.js";
import { Move } from "../move.js";

export class CastleMove extends Move {
  // Init.
  constructor(from, to, rookFrom, rookTo) {
    super(from, to, MoveType.CASTLE);
    this.rookFrom = rookFrom;
    this.rookTo = rookTo;
    this.target = this.rookFrom.piece;
  }
}
