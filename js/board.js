import { Renderable, state } from "melonjs";
import { app } from "./app.js";
import { Graveyard } from "./board/graveyard.js";
import { promotionChooser } from "./board/promotion.js";
import { Board as ChessBoard } from "./chess/board.js";
import { PieceColor, PieceType } from "./chess/enums.js";
import {
  aboveBoardY,
  BOARD_SIZE,
  boardLeft,
  centerX,
  centerY,
} from "./layout.js";
import { Piece } from "./piece.js";
import { playSound, Sound } from "./sound.js";
import { ClickArea } from "./ui/clickarea.js";
import { label } from "./ui/text.js";

// Name of a color for messages.
function colorName(color) {
  return color === PieceColor.WHITE ? "white" : "black";
}

export class Board extends Renderable {
  // Init with the computer player, or null for two players.
  constructor(computer = null) {
    // x, y, width, height
    super(centerX(), centerY(), BOARD_SIZE, BOARD_SIZE);

    // The game rules and state.
    this.game = new ChessBoard();
    this.computer = computer;

    this.borderPaddingX = 4;
    this.borderPaddingY = 4;

    // The square of the turn owner's king while it's in check.
    this.checkSquare = null;

    // A graveyard for each color's captured pieces.
    this.graveyards = {
      [PieceColor.WHITE]: this.addGraveyard(centerX() + 240),
      [PieceColor.BLACK]: this.addGraveyard(centerX() - 240),
    };

    // Whose turn it is, above the board.
    this.status = label(boardLeft(), aboveBoardY(), "");
    app.world.addChild(this.status, 2);

    // The promotion chooser's parts while it's open.
    this.promotion = [];

    // How many moves, finished turns and captures have had their sound
    // played, so sync knows what just happened.
    this.heard = this.counts();

    // A sprite for each piece.
    this.pieces = [];
    for (const color of [PieceColor.WHITE, PieceColor.BLACK]) {
      for (const piece of this.game.getPieces(color)) {
        const sprite = new Piece(this, piece);
        app.world.addChild(sprite);
        this.pieces.push(sprite);
      }
    }
    this.sync();
  }

  // Add a graveyard centered at x.
  addGraveyard(x) {
    return new Graveyard(x, centerY(), 80, BOARD_SIZE, 8, 2);
  }

  // Move a dropped piece to the given square if that's a legal move.
  dropPiece(sprite, square) {
    this.game.move(sprite.piece.square, square);
    this.sync();
  }

  // Place every sprite where the game says its piece is, and bury captured
  // pieces in their graveyard. A captured piece is drawn by its grave, so its
  // sprite is removed, which also stops it taking input.
  sync() {
    for (const sprite of this.pieces) {
      const piece = sprite.piece;
      if (piece.isDead()) {
        this.graveyards[piece.color].addPiece(piece);
        app.world.removeChild(sprite);
      } else {
        sprite.positionOnSquare(piece.square);
      }
    }
    this.pieces = this.pieces.filter((sprite) => !sprite.piece.isDead());
    this.showPromotion();
    app.world.sort(true);
    this.showStatus();
    this.playMoveSound();
    this.playComputer();
  }

  // The number of moves, finished turns and captures so far.
  counts() {
    return {
      moves: this.game.history.length,
      turns: this.game.positions.length,
      captures: this.game.captured.length,
    };
  }

  // Play a sound for whatever happened since the last sync: the end of the
  // game, check, a capture or a plain move, whichever matters most. A
  // promoting pawn's turn ends when its new piece is chosen, so that gets a
  // sound too.
  playMoveSound() {
    const now = this.counts();
    const moved = now.moves > this.heard.moves;
    const turned = now.turns > this.heard.turns;
    if (turned && this.game.isGameOver()) {
      playSound(this.game.isCheckmate() ? Sound.CHECKMATE : Sound.DRAW);
    } else if (turned && this.checkSquare != null) {
      playSound(Sound.CHECK);
    } else if (now.captures > this.heard.captures) {
      playSound(Sound.CAPTURE);
    } else if (moved || turned) {
      playSound(Sound.MOVE);
    }
    this.heard = now;
  }

  // True if it's the computer's turn.
  isComputerTurn() {
    return this.computer?.color === this.game.turnOwner;
  }

  // Have the computer move if it's its turn. It always promotes to a queen.
  playComputer() {
    if (
      !this.isComputerTurn() ||
      this.computer.thinking ||
      this.game.isGameOver()
    ) {
      return;
    }
    this.status.setText(`${colorName(this.game.turnOwner)} thinking`);
    this.computer.think(this.game, ({ from, to }) => {
      this.game.move(from, to);
      if (this.game.isPromotingPawn()) {
        this.game.finishPawnPromotion(PieceType.QUEEN);
      }
      this.sync();
    });
  }

  // Stop the computer thinking, when leaving the game.
  stop() {
    this.computer?.stop();
  }

  // Below the board, about as far from it as the status is above it.
  belowBoardY() {
    return this.pos.y + this.height / 2 + 36;
  }

  // Open the promotion chooser while a pawn waits to be promoted, and close
  // it once the pawn has been promoted.
  showPromotion() {
    const promoting = this.game.isPromotingPawn();
    if (promoting && this.promotion.length === 0) {
      this.promotion = promotionChooser(
        boardLeft(),
        this.belowBoardY(),
        this.squareSize(),
        this.game.turnOwner,
        (type) => {
          this.game.finishPawnPromotion(type);
          this.sync();
        },
      );
      for (const child of this.promotion) {
        app.world.addChild(child, 2);
      }
    } else if (!promoting) {
      for (const child of this.promotion) {
        app.world.removeChild(child);
      }
      this.promotion = [];
    }
  }

  // Show whose turn it is, mark the king's square if it's in check, and
  // announce the end of the game.
  showStatus() {
    const turnOwner = this.game.turnOwner;
    const inCheck = this.game.isInCheck(turnOwner);
    this.checkSquare = inCheck
      ? this.game.getPieces(turnOwner).find((p) => p.type === PieceType.KING)
          .square
      : null;

    if (this.game.isGameOver()) {
      this.status.setText(
        this.game.isCheckmate() ? "checkmate" : this.game.drawReason(),
      );

      app.world.addChild(
        label(boardLeft(), this.belowBoardY(), "click to continue"),
        2,
      );

      // Clicking anywhere opens the summary screen.
      app.world.addChild(
        new ClickArea(0, 0, app.viewport.width, app.viewport.height, () =>
          state.change(state.GAMEOVER, false, this.game, this.computer),
        ),
        100,
      );
    } else {
      const name = colorName(turnOwner);
      this.status.setText(inCheck ? `${name} in check` : `${name} move`);
    }
  }

  // Update.
  update(dt) {
    super.update(dt);
    return true;
  }

  // Draw the border, then the squares, with the square of a king in check
  // in red.
  draw(renderer) {
    renderer.setColor("#444");
    renderer.fillRect(
      this.pos.x - this.borderPaddingX,
      this.pos.y - this.borderPaddingY,
      this.width + this.borderPaddingX * 2,
      this.height + this.borderPaddingY * 2,
    );
    const size = this.squareSize();
    for (let r = 0; r < 8; ++r) {
      for (let c = 0; c < 8; ++c) {
        let color = (r + c) % 2 === 0 ? "#fff" : "#000";
        if (this.checkSquare?.row === r && this.checkSquare?.column === c) {
          color = "#c33";
        }
        renderer.setColor(color);
        renderer.fillRect(
          this.pos.x + c * size,
          this.pos.y + r * size,
          size,
          size,
        );
      }
    }
  }

  // Width and height of a square, in pixels.
  squareSize() {
    return this.width / 8;
  }

  // The center of the given square, in world coordinates.
  squareCenter(square) {
    const size = this.squareSize();
    return {
      x: this.pos.x - this.width / 2 + (square.column + 0.5) * size,
      y: this.pos.y - this.height / 2 + (square.row + 0.5) * size,
    };
  }

  // Get the square under x, y, or the nearest edge square if x, y is off
  // the board.
  getClosestSquare(x, y) {
    const size = this.squareSize();
    const index = (offset) => Math.min(7, Math.max(0, Math.floor(offset)));
    return this.game.getSquare(
      index((y - this.pos.y + this.height / 2) / size),
      index((x - this.pos.x + this.width / 2) / size),
    );
  }
}
