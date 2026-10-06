import { Renderable } from "melonjs";
import { app } from "../app.js";

export class Grave extends Renderable {
  // Init.
  constructor(x, y, width, height, color, row, column) {
    // x, y, width, height
    super(x, y, width, height);
    this.color = color;
    this.row = row;
    this.column = column;
    this.piece = null;
    this.borderPaddingX = 2;
    this.borderPaddingY = 2;
  }

  // Update.
  update() {
    return false;
  }

  // Draw.
  draw(renderer) {
    renderer.setColor('#444');
    renderer.fillRect(
      this.pos.x,
      this.pos.y,
      this.width, this.height);
    renderer.setColor(this.color);
    renderer.fillRect(
      this.pos.x + this.borderPaddingX,
      this.pos.y + this.borderPaddingY,
      this.width - this.borderPaddingX * 2,
      this.height - this.borderPaddingY * 2);
  }

  // True if occupied.
  isOccupied() {
    return this.piece != null;
  }

  // True if located at column, row.
  isLocatedAt(c, r) {
    return this.row === r && this.column === c;
  }

  // Add the specified piece.
  addPiece(piece) {
    if (this.isOccupied() == true) {
      return;
    }
    piece.pos.x = this.pos.x - piece.width / 2;
    piece.pos.y = this.pos.y - piece.height / 2 + piece.offsetY;
    piece.pos.z = this.row + 2;
    piece.square.piece = null;
    piece.square = null;
    this.piece = piece;
    app.world.sort(true);
  }
}
