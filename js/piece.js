import { Draggable, event, input, loader } from "melonjs";
import { app } from "./app.js";

// Size of a single frame in the pieces sprite sheet.
export const FRAME_SIZE = 64;

// How far a piece is drawn above the center of the square it stands on.
export const OFFSET_Y = -20;

// Draw the sprite of a piece of the given type and color with its top-left
// corner at x, y.
export function drawPiece(renderer, type, color, x, y) {
  const image = loader.getImage("pieces");
  // Type and color enum int values match sprite sheet frames.
  const frame = type * 2 + color;
  const framesPerRow = image.width / FRAME_SIZE;
  renderer.drawImage(
    image,
    (frame % framesPerRow) * FRAME_SIZE,
    Math.floor(frame / framesPerRow) * FRAME_SIZE,
    FRAME_SIZE,
    FRAME_SIZE,
    x,
    y,
    FRAME_SIZE,
    FRAME_SIZE,
  );
}

export class Piece extends Draggable {
  // Init with the board view and the game piece this sprite shows.
  constructor(board, piece) {
    super(0, 0, FRAME_SIZE, FRAME_SIZE);

    // Position from the top-left corner (melonJS defaults to the center).
    this.anchorPoint.set(0, 0);

    this.board = board;
    this.piece = piece;
    this.offsetY = OFFSET_Y;
  }

  // Update.
  update(dt) {
    super.update(dt);
    return true;
  }

  // Draw.
  draw(renderer) {
    drawPiece(
      renderer,
      this.piece.type,
      this.piece.color,
      this.pos.x,
      this.pos.y,
    );
  }

  // Position this piece on the given square.
  positionOnSquare(square) {
    this.pos.x = square.pos.x - this.width / 2;
    this.pos.y = square.pos.y - this.height / 2 + this.offsetY;
    this.pos.z = square.row + 2;
  }

  // True if it's this piece's player's turn.
  isTurnOwner() {
    return this.piece.isColor(this.board.game.turnOwner);
  }

  // Init events including input events.
  // Note: called from the Draggable constructor, before this class's fields are set.
  initEvents() {
    super.initEvents();

    // Remove the default pointerdown and pointerup events.
    input.releasePointerEvent("pointerdown", this);
    input.releasePointerEvent("pointerup", this);

    // Add new events that return false (don't fall through to overlapping pieces).
    input.registerPointerEvent("pointerdown", this, (e) => {
      // Only the turn owner may pick up pieces.
      if (!this.isTurnOwner()) {
        return false;
      }
      event.emit(event.DRAGSTART, e, this);
      return false;
    });
    input.registerPointerEvent("pointerup", this, (e) => {
      // Only the turn owner may drop pieces.
      if (!this.isTurnOwner()) {
        return false;
      }
      event.emit(event.DRAGEND, e, this);
      return false;
    });
  }

  // Drag start event.
  dragStart(e) {
    // Pieces stay put while the promotion chooser is open.
    if (!this.board.game.isPromotingPawn()) {
      // Pick the piece up.
      this.pos.z = 50;
      app.world.sort(true);
      super.dragStart(e);
    }
  }

  // Drag end event.
  dragEnd(e) {
    if (this.board.game.isPromotingPawn()) {
      return;
    }
    // Drop the piece on the nearest square.
    const square = this.board.getSquare(
      this.piece.square.row,
      this.piece.square.column,
    );
    const closestSquare = this.board.getClosestSquare(
      this.pos.x - (square.width - this.width) / 2,
      this.pos.y - ((square.height - this.height) / 2 + this.offsetY),
    );
    super.dragEnd(e);
    this.board.dropPiece(this, closestSquare);
  }
}
