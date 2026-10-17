import { Renderable } from "melonjs";
import { drawPiece, FRAME_SIZE, OFFSET_Y } from "../piece.js";

export class Grave extends Renderable {
  // Init.
  constructor(x, y, width, height, color) {
    // x, y, width, height
    super(x, y, width, height);
    this.color = color;
    // The captured piece buried here, if any.
    this.piece = null;
    this.borderPaddingX = 2;
    this.borderPaddingY = 2;
  }

  // Update.
  update() {
    return false;
  }

  // Draw the grave, then the piece buried in it, standing on it the way
  // pieces stand on board squares.
  draw(renderer) {
    renderer.setColor("#444");
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    renderer.setColor(this.color);
    renderer.fillRect(
      this.pos.x + this.borderPaddingX,
      this.pos.y + this.borderPaddingY,
      this.width - this.borderPaddingX * 2,
      this.height - this.borderPaddingY * 2,
    );
    if (this.piece != null) {
      drawPiece(
        renderer,
        this.piece.type,
        this.piece.color,
        this.pos.x + (this.width - FRAME_SIZE) / 2,
        this.pos.y + (this.height - FRAME_SIZE) / 2 + OFFSET_Y,
      );
    }
  }
}
