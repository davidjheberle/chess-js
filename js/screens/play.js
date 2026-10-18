import { ColorLayer, Stage } from "melonjs";
import { Board } from "../board.js";

export class PlayScreen extends Stage {
  /**
   * action to perform on state change, with the computer player, or none
   * for two players
   */
  onResetEvent(app, computer = null) {
    // Add a background color.
    app.world.addChild(new ColorLayer("background", "#000000"), -1);

    // Create the board.
    this.board = new Board(computer);
    app.world.addChild(this.board, 0);
  }

  /**
   * action to perform when leaving this screen
   */
  onDestroyEvent() {
    this.board.stop();
  }
}
