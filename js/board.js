import { Renderable } from "melonjs";
import { app } from "./app.js";
import { Square } from "./board/square.js";
import { PieceColor } from "./enums.js";
import { Player } from "./player.js";

export class Board extends Renderable {
  // Init.
  constructor() {
    // x, y, width, height
    super(app.viewport.width / 2, app.viewport.height / 2, 320, 320);

    this.turnOwner = PieceColor.BLACK;
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

    // Create 2 players and have them set up their pieces.
    this.player1 = new Player(PieceColor.WHITE, this);
    this.player2 = new Player(PieceColor.BLACK, this);

    this.switchTurnOwner();
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

  // Get sqaure at row, column.
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

  // Switch the turn owner.
  switchTurnOwner() {
    switch (this.turnOwner) {
      case PieceColor.WHITE:
        this.turnOwner = PieceColor.BLACK;
        this.player2.startTurn();
        this.calculateMoves();
        break;

      case PieceColor.BLACK:
        this.turnOwner = PieceColor.WHITE;
        this.player1.startTurn();
        this.calculateMoves();
        break;
    }
  }

  // Calculate all possible moves.
  calculateMoves() {
    let piece;
    const pieces = [];
    for (let r = 0; r < this.squares.length; ++r) {
      for (let c = 0; c < this.squares[r].length; ++c) {
        this.squares[r][c].threats = [];
        piece = this.squares[r][c].piece;
        if (piece != null) {
          pieces.push(piece);
        }
      }
    }
    pieces.forEach((p) => {
      p.behavior.calculateMoves();
    });
    pieces.forEach((p) => {
      p.behavior.pruneMoves();
    });
  }
}
