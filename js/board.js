import { Renderable, state } from "melonjs";
import { app } from "./app.js";
import { Graveyard } from "./board/graveyard.js";
import { Square } from "./board/square.js";
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

    // 2d array of squares [row, column].
    this.squares = [];

    let square;
    const squareWidth = this.width / 8;
    const squareHeight = this.height / 8;
    const originX = -this.width / 2 + squareWidth / 2;
    let squareX = originX;
    let squareY = -this.height / 2 + squareHeight / 2;
    let squareColor;
    for (let r = 0; r < 8; ++r) {
      this.squares.push([]);
      for (let c = 0; c < 8; ++c) {
        if ((r + c) % 2 === 0) {
          squareColor = "#fff";
        } else {
          squareColor = "#000";
        }
        square = new Square(
          this.pos.x + squareX,
          this.pos.y + squareY,
          squareWidth,
          squareHeight,
          squareColor,
          r,
          c,
        );
        app.world.addChild(square, 1);
        this.squares[r].push(square);
        squareX += squareWidth;
      }
      squareY += squareHeight;
      squareX = originX;
    }

    // A graveyard for each color's captured pieces.
    this.graveyards = {
      [PieceColor.WHITE]: this.addGraveyard(app.viewport.width / 2 + 240),
      [PieceColor.BLACK]: this.addGraveyard(app.viewport.width / 2 - 240),
    };

    // Whose turn it is, above the board.
    this.status = label(boardLeft(), this.pos.y - this.height / 2 - 56, "");
    app.world.addChild(this.status, 2);

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
    const graveyard = new Graveyard(
      x,
      app.viewport.height / 2,
      80,
      BOARD_SIZE,
      8,
      2,
    );
    app.world.addChild(graveyard, 0);
    return graveyard;
  }

  // Move a dropped piece to the given square if that's a legal move.
  dropPiece(sprite, square) {
    const from = sprite.piece.square;
    this.game.move(from, this.game.getSquare(square.row, square.column));
    this.sync();
  }

  // Place every sprite where the game says its piece is.
  sync() {
    for (const sprite of this.pieces) {
      const piece = sprite.piece;
      if (piece.isDead()) {
        if (sprite.grave == null) {
          this.graveyards[piece.color].addPiece(sprite);
        }
      } else {
        sprite.positionOnSquare(
          this.getSquare(piece.square.row, piece.square.column),
        );
      }
    }
    app.world.sort(true);
    this.showStatus();
  }

  // Show whose turn it is, mark the king's square if it's in check, and
  // announce the end of the game.
  showStatus() {
    const turnOwner = this.game.turnOwner;
    const inCheck = this.game.isInCheck(turnOwner);
    const king = this.game
      .getPieces(turnOwner)
      .find((p) => p.type === PieceType.KING);
    for (const row of this.squares) {
      for (const square of row) {
        square.inCheck =
          inCheck &&
          square.row === king.square.row &&
          square.column === king.square.column;
      }
    }

    if (this.game.isGameOver()) {
      this.status.setText(this.game.isCheckmate() ? "checkmate" : "stalemate");

      // Below the board, about as far from it as the status is above it.
      app.world.addChild(
        label(
          boardLeft(),
          this.pos.y + this.height / 2 + 36,
          "click to continue",
        ),
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

  // Draw.
  draw(renderer) {
    renderer.setColor("#444");
    renderer.fillRect(
      this.pos.x - this.borderPaddingX,
      this.pos.y - this.borderPaddingY,
      this.width + this.borderPaddingX * 2,
      this.height + this.borderPaddingY * 2,
    );
  }

  // Get square at row, column.
  getSquare(r, c) {
    if (r < 0 || c < 0) {
      return null;
    }
    if (r >= this.squares.length) {
      return null;
    }
    if (c >= this.squares[r].length) {
      return null;
    }
    return this.squares[r][c];
  }

  // Get closest square to x, y position.
  getClosestSquare(x, y) {
    let closestX = Number.POSITIVE_INFINITY;
    let closestY = Number.POSITIVE_INFINITY;
    let closestR = -1;
    let closestC = -1;
    let workX;
    let workY;
    for (let i = 0; i < this.squares.length; ++i) {
      workX = Math.abs(
        x - this.squares[0][i].pos.x + this.squares[0][i].width / 2,
      );
      if (workX < closestX) {
        closestX = workX;
        closestC = i;
      }

      workY = Math.abs(
        y - this.squares[i][0].pos.y + this.squares[i][0].height / 2,
      );
      if (workY < closestY) {
        closestY = workY;
        closestR = i;
      }
    }
    return this.getSquare(closestR, closestC);
  }
}
