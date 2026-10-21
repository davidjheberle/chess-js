import { ColorLayer, Stage, state } from "melonjs";
import { PieceColor } from "../chess/enums.js";
import { boardLeft, centerY } from "../layout.js";
import { Button } from "../ui/button.js";
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
    app.world.addChild(
      new Button(x, y + 6, "play again", () =>
        state.change(state.PLAY, false, computer),
      ),
      1,
    );
    app.world.addChild(
      new Button(x, y + 52, "main menu", () => state.change(state.MENU)),
      1,
    );
  }

  // What onResetEvent needs to lay the screen out again.
  relayoutArgs() {
    return this.args;
  }
}
