import { Renderable } from "melonjs";
import { app } from "../app.js";
import { Grave } from "./grave.js";

export class Graveyard extends Renderable {
  // Init.
  constructor(x, y, width, height, rows, columns) {
    super(x, y, width, height);

    this.numRows = rows;
    this.numColumns = columns;
    this.borderPaddingX = 2;
    this.borderPaddingY = 2;

    // Array of graves.
    this.graves = [];
    this.graveIndex = 0;

    let grave;
    const graveWidth = width / this.numColumns;
    const graveHeight = height / this.numRows;
    const originX = -width / 2 + graveWidth / 2;
    let graveX = originX;
    let graveY = -this.height / 2 + graveHeight / 2;
    for (let r = 0; r < this.numRows; ++r) {
      for (let c = 0; c < this.numColumns; ++c) {
        grave = new Grave(
          this.pos.x + graveX,
          this.pos.y + graveY,
          graveWidth,
          graveHeight,
          "#aaa",
          r,
          c,
        );
        app.world.addChild(grave, 1);
        this.graves.push(grave);
        graveX += graveWidth;
      }
      graveY += graveHeight;
      graveX = originX;
    }
  }

  // Update.
  update(dt) {
    super.update(dt);
    return true;
  }

  // Draw.
  draw(renderer) {
    renderer.setColor("#444");
    renderer.fillRect(
      this.pos.x + this.borderPaddingX,
      this.pos.y + this.borderPaddingY,
      this.width - this.borderPaddingX * 2,
      this.height - this.borderPaddingY * 2,
    );
  }

  // Add a piece to the graveyard.
  addPiece(piece) {
    // Get the next open space and add this piece there.
    if (this.graveIndex >= this.graves.length) {
      return;
    }

    // Add piece to the grave.
    this.graves[this.graveIndex].addPiece(piece);

    // Increment grave index.
    this.graveIndex++;
  }

  // True if graveyard is empty.
  isEmpty() {
    return this.graveIndex === 0;
  }
}
