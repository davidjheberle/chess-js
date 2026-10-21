import { ColorLayer, Stage, state } from "melonjs";
import { PieceColor } from "../chess/enums.js";
import { boardLeft, centerY } from "../layout.js";
import { Button } from "../ui/button.js";
import { FocusGroup } from "../ui/focus.js";
import { releaseKeys, takeKeys } from "../ui/keys.js";
import { label } from "../ui/text.js";

// Shown when a game ends, with the finished game and the computer player
// (or null for two players) passed in.
export class SummaryScreen extends Stage {
  /**
   * action to perform on state change
   */
  onResetEvent(app, game, computer = null) {
    this.args = [game, computer];
    const x = boardLeft();
    const y = centerY();

    let title = game.drawReason();
    let result = "draw";
    if (game.isCheckmate()) {
      // The player who can't move has lost.
      title = "checkmate";
      const winner =
        game.turnOwner === PieceColor.WHITE
          ? PieceColor.BLACK
          : PieceColor.WHITE;
      if (computer == null) {
        result = winner === PieceColor.WHITE ? "white wins" : "black wins";
      } else {
        result = winner === computer.color ? "computer wins" : "you win";
      }
    }

    app.world.addChild(new ColorLayer("background", "#000000"), -1);
    app.world.addChild(label(x, y - 58, title), 1);
    app.world.addChild(label(x, y - 34, result), 1);
    const buttons = [
      new Button(x, y + 6, "play again", () =>
        state.change(state.PLAY, false, computer),
      ),
      new Button(x, y + 52, "main menu", () => state.change(state.MENU)),
    ];
    for (const button of buttons) {
      app.world.addChild(button, 1);
    }

    // The arrow keys move between the buttons.
    this.keys = new FocusGroup(buttons);
    takeKeys(this.keys);
  }

  // What onResetEvent needs to lay the screen out again.
  relayoutArgs() {
    return this.args;
  }

  /**
   * action to perform when leaving this screen
   */
  onDestroyEvent() {
    releaseKeys(this.keys);
  }
}
