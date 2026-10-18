import { ColorLayer, Stage, state } from "melonjs";
import { PieceColor } from "../chess/enums.js";
import { boardLeft, centerY } from "../layout.js";
import { Button } from "../ui/button.js";
import { label } from "../ui/text.js";

// Shown when a game ends, with the finished game passed in.
export class SummaryScreen extends Stage {
  /**
   * action to perform on state change
   */
  onResetEvent(app, game) {
    const x = boardLeft();
    const y = centerY();

    let title = game.drawReason();
    let result = "draw";
    if (game.isCheckmate()) {
      // The player who can't move has lost.
      title = "checkmate";
      result =
        game.turnOwner === PieceColor.WHITE ? "black wins" : "white wins";
    }

    app.world.addChild(new ColorLayer("background", "#000000"), -1);
    app.world.addChild(label(x, y - 58, title), 1);
    app.world.addChild(label(x, y - 34, result), 1);
    app.world.addChild(
      new Button(x, y + 6, "play again", () => state.change(state.PLAY)),
      1,
    );
    app.world.addChild(
      new Button(x, y + 52, "main menu", () => state.change(state.MENU)),
      1,
    );
  }
}
