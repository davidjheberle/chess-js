import { app } from "../app.js";
import { Grave } from "./grave.js";

// A grid of graves centered on x, y, filled with captured pieces in order.
export class Graveyard {
  // Init.
  constructor(x, y, width, height, rows, columns) {
    // Array of graves.
    this.graves = [];
    this.graveIndex = 0;

    const graveWidth = width / columns;
    const graveHeight = height / rows;
    const left = x - width / 2 + graveWidth / 2;
    const top = y - height / 2 + graveHeight / 2;
    for (let r = 0; r < rows; ++r) {
      for (let c = 0; c < columns; ++c) {
        const grave = new Grave(
          left + c * graveWidth,
          top + r * graveHeight,
          graveWidth,
          graveHeight,
          "#aaa",
        );
        app.world.addChild(grave, 1);
        this.graves.push(grave);
      }
    }
  }

  // Bury a captured piece in the next open grave.
  addPiece(piece) {
    if (this.graveIndex >= this.graves.length) {
      return;
    }
    this.graves[this.graveIndex].piece = piece;
    this.graveIndex++;
  }
}
