import { MoveType } from "../../enums.js";
import { Move } from "../move.js";

export class DefaultMove extends Move {
  // Init.
  constructor(from, to) {
    super(from, to, MoveType.DEFAULT);
    this.to.threats.push(this.piece);
  }
}
