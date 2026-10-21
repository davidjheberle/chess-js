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
    const center = this.board.squareCenter(square);
    this.pos.x = center.x - this.width / 2;
    this.pos.y = center.y - this.height / 2 + this.offsetY;
    this.pos.z = square.row + 2;
  }

  // True if it's this piece's player's turn, and that player isn't the
  // computer.
  canMove() {
    return (
      this.piece.isColor(this.board.game.turnOwner) &&
      !this.board.isComputerTurn()
    );
  }

  // Init events including input events.
  // Note: called from the Draggable constructor, before this class's fields are set.
  initEvents() {
    super.initEvents();

    // The board picks pieces up (see Board.pickUp), and the drag ends
    // wherever the pointer is let go (see dragStart), so pieces take no
    // pointer events of their own.
    input.releasePointerEvent("pointerdown", this);
    input.releasePointerEvent("pointerup", this);
    input.releasePointerEvent("pointercancel", this);

    // Let go of the piece when the pointer that picked it up is lifted,
    // even outside the canvas.
    this.handleRelease = (e) => {
      if (e.pointerId === this.dragId) {
        event.emit(event.DRAGEND, e, this);
      }
    };
  }

  // Drag start event.
  dragStart(e) {
    // Pieces stay put while the promotion chooser is open.
    if (this.board.game.isPromotingPawn() || this.dragging) {
      return;
    }
    // Pick the piece up.
    this.pos.z = 50;
    app.world.sort(true);
    super.dragStart(e);
    this.dragId = e.pointerId;
    // A finger would hide the piece, so it's held above the finger, its
    // base a square higher. It drops where it's drawn, as with a mouse.
    if (e.event.pointerType === "touch") {
      this.grabOffset.set(
        this.width / 2,
        this.board.squareSize() + this.height / 2 - this.offsetY,
      );
      this.dragMove(e);
    }
    window.addEventListener("pointerup", this.handleRelease);
    window.addEventListener("pointercancel", this.handleRelease);
  }

  // Drag move event. Only the pointer that picked the piece up moves it, so
  // a second finger on the screen doesn't.
  dragMove(e) {
    if (e.pointerId === this.dragId) {
      super.dragMove(e);
    }
  }

  // Drag end event.
  dragEnd(e) {
    if (!this.dragging) {
      return;
    }
    this.stopListening();
    const square = this.dropSquare();
    super.dragEnd(e);
    this.board.dropPiece(this, square);
  }

  // The square nearest to where the piece's base is, which is where it
  // would land if dropped now.
  dropSquare() {
    return this.board.getClosestSquare(
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2 - this.offsetY,
    );
  }

  // Stop waiting for the pointer to be lifted.
  stopListening() {
    window.removeEventListener("pointerup", this.handleRelease);
    window.removeEventListener("pointercancel", this.handleRelease);
    this.dragId = null;
  }

  // Remove listeners when the piece is captured or the screen changes,
  // even mid-drag.
  onDestroyEvent() {
    this.stopListening();
  }
}
