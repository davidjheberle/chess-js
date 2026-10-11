import { Renderable } from "melonjs";

export class Square extends Renderable {
  // Init.
  constructor(x, y, width, height, color, row, column) {
    // x, y, width, height
    super(x, y, width, height);
    this.color = color;
    this.row = row;
    this.column = column;
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
}
