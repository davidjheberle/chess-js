import { ColorLayer, Stage } from "melonjs";
import { Board } from "../board.js";

export class PlayScreen extends Stage {
  /**
   * action to perform on state change
   */
  onResetEvent(app) {
    // Add a background color.
    app.world.addChild(new ColorLayer("background", "#000000"), -1);

    // Create the board.
    app.world.addChild(new Board(), 0);
  }
}
