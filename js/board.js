import { Renderable, state } from "melonjs";
import { app } from "./app.js";
import { Graveyard } from "./board/graveyard.js";
import { promotionChooser } from "./board/promotion.js";
import { Board as ChessBoard } from "./chess/board.js";
import { PieceColor, PieceType } from "./chess/enums.js";
import { BOARD_SIZE, boardLeft } from "./layout.js";
import { Piece } from "./piece.js";
import { ClickArea } from "./ui/clickarea.js";
import { label } from "./ui/text.js";

// Name of a color for messages.
function colorName(color) {
  return color === PieceColor.WHITE ? "white" : "black";
}

export class Board extends Renderable {
  // Init.
  constructor() {
    // x, y, width, height
    super(
      app.viewport.width / 2,
      app.viewport.height / 2,
      BOARD_SIZE,
      BOARD_SIZE,
    );

    // The game rules and state.
    this.game = new ChessBoard();

    this.borderPaddingX = 4;
    this.borderPaddingY = 4;

    // The square of the turn owner's king while it's in check.
    this.checkSquare = null;

    // A graveyard for each color's captured pieces.
    this.graveyards = {
      [PieceColor.WHITE]: this.addGraveyard(app.viewport.width / 2 + 240),
      [PieceColor.BLACK]: this.addGraveyard(app.viewport.width / 2 - 240),
    };

    // Whose turn it is, above the board.
    this.status = label(boardLeft(), this.pos.y - this.height / 2 - 56, "");
    app.world.addChild(this.status, 2);

    // The promotion chooser's parts while it's open.
    this.promotion = [];

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
    return new Graveyard(x, app.viewport.height / 2, 80, BOARD_SIZE, 8, 2);
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
      this.status.setText(this.game.isCheckmate() ? "checkmate" : "stalemate");

      app.world.addChild(
        label(boardLeft(), this.belowBoardY(), "click to continue"),
        2,
      );

      // Clicking anywhere opens the summary screen.
      app.world.addChild(
        new ClickArea(0, 0, app.viewport.width, app.viewport.height, () =>
          state.change(state.GAMEOVER, false, this.game),
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
