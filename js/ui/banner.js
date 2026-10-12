import { UIBaseElement } from "melonjs";
import { boardLeft } from "../layout.js";
import { label } from "./text.js";

const HEIGHT = 100;

// A message in a band across the middle of the screen. Covers the whole
// screen so that clicking anywhere calls onClick.
export class Banner extends UIBaseElement {
  constructor(width, height, text, onClick) {
    super(0, 0, width, height);
    this.action = onClick;
    const x = boardLeft();
    this.addChild(label(x, height / 2 - 12, text, 32));
    this.addChild(label(x, height / 2 + 26, "click to continue", 16));
  }

  // Draw the band, then the text.
  draw(renderer, viewport) {
    renderer.setColor("rgba(0, 0, 0, 0.75)");
    renderer.fillRect(0, (this.height - HEIGHT) / 2, this.width, HEIGHT);
    super.draw(renderer, viewport);
  }

  onClick() {
    this.action();
    return false;
  }
}
