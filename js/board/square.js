import { Renderable } from "melonjs";
import { PieceColor } from "../enums.js";

export class Square extends Renderable {
  // Init.
  constructor(x, y, width, height, color, row, column) {
    // x, y, width, height
    super(x, y, width, height);
    this.color = color;
    this.row = row;
    this.column = column;
    this.piece = null;
    this.threats = [];
  }

  // Draw.
  draw(renderer) {
    renderer.setColor(this.color);
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  // Update.
  update() {
    return false;
  }

  // Return true if this square is occupied by a piece.
  isOccupied() {
    return this.piece != null;
  }

  // Check the square's rank based on color.
  isOnRank(rank, color) {
    switch (color) {
      case PieceColor.WHITE:
        // Check if the current space's row is 8 - rank.
        return this.row === 8 - rank;

      case PieceColor.BLACK:
        // Check if the current space's row is rank - 1.
        return this.row === rank - 1;
    }
    return false;
  }

  // Return true if the provided color is threatened on this square.
  isThreatened(color) {
    return this.threats.filter((t) => t.color !== color).length > 0;
  }

  // Equals function.
  equals(square) {
    return this.row === square.row && this.column === square.column;
  }
}
