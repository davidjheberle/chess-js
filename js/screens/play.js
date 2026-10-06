import { ColorLayer, Stage, input } from "melonjs";
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

    // Bind input.
    input.bindKey(input.KEY.LEFT, "left");
    input.bindKey(input.KEY.RIGHT, "right");
    input.bindKey(input.KEY.A, "left");
    input.bindKey(input.KEY.D, "right");
  }

  /**
   * action to perform when leaving this screen (state change)
   */
  onDestroyEvent() {
    // Unbind input.
    input.unbindKey(input.KEY.LEFT);
    input.unbindKey(input.KEY.RIGHT);
    input.unbindKey(input.KEY.A);
    input.unbindKey(input.KEY.D);
  }
}
