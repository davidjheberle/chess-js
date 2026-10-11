import { MoveType } from "../../enums.js";
import { Move } from "../move.js";

export class EnpassantMove extends Move {
  // Init.
  constructor(from, to, enpassant) {
    super(from, to, MoveType.ENPASSANT);
    this.enpassant = enpassant;
    this.target = this.enpassant.piece;
  }
}
