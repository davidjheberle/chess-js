import { ColorLayer, Stage, state } from "melonjs";
import { Board } from "../board.js";
import { aboveBoardY, BOARD_SIZE, boardLeft } from "../layout.js";
import { Button } from "../ui/button.js";
import { Settings } from "../ui/settings.js";

// Width of the button that opens the settings.
const MENU_BUTTON_WIDTH = 80;

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

    // Quitting abandons the game and goes back to the main menu. (Stage
    // already has a "settings" property.)
    this.settingsPanel = new Settings({
      onQuit: () => state.change(state.MENU),
    });

    // Lined up with the board's right edge, above it. It stays clickable
    // once the game is over.
    app.world.addChild(
      new Button(
        boardLeft() + BOARD_SIZE - MENU_BUTTON_WIDTH,
        aboveBoardY(),
        "menu",
        () => this.settingsPanel.open(),
        { width: MENU_BUTTON_WIDTH },
      ),
      150,
    );
  }

  /**
   * action to perform when leaving this screen
   */
  onDestroyEvent() {
    this.board.stop();
    this.settingsPanel.destroy();
  }
}
