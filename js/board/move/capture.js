import { MoveType } from "../../enums.js";
import { Move } from "../move.js";

export class CaptureMove extends Move {
  // Init.
  constructor(from, to) {
    super(from, to, MoveType.CAPTURE);
    this.to.threats.push(this.piece);
  }
}
