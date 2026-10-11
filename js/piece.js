import { Draggable, event, input, loader } from "melonjs";
import { app } from "./app.js";
import { PieceState, PieceType } from "./enums.js";
import { BishopBehavior } from "./piece/behavior/bishop.js";
import { KingBehavior } from "./piece/behavior/king.js";
import { KnightBehavior } from "./piece/behavior/knight.js";
import { PawnBehavior } from "./piece/behavior/pawn.js";
import { QueenBehavior } from "./piece/behavior/queen.js";
import { RookBehavior } from "./piece/behavior/rook.js";

// Size of a single frame in the pieces sprite sheet.
const FRAME_SIZE = 64;

export class Piece extends Draggable {
  // Init.
  constructor(player, pieceType, pieceColor) {
    super(0, 0, FRAME_SIZE, FRAME_SIZE);

    // Position from the top-left corner (melonJS defaults to the center).
    this.anchorPoint.set(0, 0);

    this.image = loader.getImage("pieces");
    this.player = player;
    this.offsetY = -20;
    this.moveCount = 0;
    this.setTypeAndColor(pieceType, pieceColor);
  }

  // Update.
  update(dt) {
    super.update(dt);
    return true;
  }

  // Draw.
  draw(renderer) {
    const framesPerRow = this.image.width / FRAME_SIZE;
    renderer.drawImage(
      this.image,
      (this.frame % framesPerRow) * FRAME_SIZE,
      Math.floor(this.frame / framesPerRow) * FRAME_SIZE,
      FRAME_SIZE,
      FRAME_SIZE,
      this.pos.x,
      this.pos.y,
      this.width,
      this.height,
    );
  }

  // Set this piece type and color.
  setTypeAndColor(type, color) {
    this.type = type;
    this.color = color;
    this.choosePieceImage(type, color);
    this.setBehavior(type);
  }

  // Choose the piece image based on the piece type and color.
  choosePieceImage(type, color) {
    // Type and frame enum int values match sprite sheet frames.
    this.frame = type * 2 + color;
  }

  // Set the behavior of the piece.
  setBehavior(type) {
    switch (type) {
      case PieceType.PAWN:
        this.behavior = new PawnBehavior(this);
        break;

      case PieceType.ROOK:
        this.behavior = new RookBehavior(this);
        break;

      case PieceType.KNIGHT:
        this.behavior = new KnightBehavior(this);
        break;

      case PieceType.BISHOP:
        this.behavior = new BishopBehavior(this);
        break;

      case PieceType.QUEEN:
        this.behavior = new QueenBehavior(this);
        break;

      case PieceType.KING:
        this.behavior = new KingBehavior(this);
        break;
    }
  }

  // Set piece state.
  setPieceState(state) {
    const prevState = this.state;
    this.state = state;
    switch (this.state) {
      case PieceState.IDLE:
        // If the piece was held and is now idle.
        if (prevState === PieceState.HELD) {
          // Place it on the nearest space.
          const closestSquare = this.player.board.getClosestSquare(
            this.pos.x - (this.square.width - this.width) / 2,
            this.pos.y -
              ((this.square.height - this.height) / 2 + this.offsetY),
          );

          this.behavior.moveToSquare(closestSquare);
        }
        break;

      case PieceState.HELD:
        // Piece has been picked up.
        this.pos.z = 50;
        app.world.sort(true);
        break;

      case PieceState.DEAD:
        // Send this piece to its player's graveyard.
        this.player.graveyard.addPiece(this);
        break;
    }
  }

  // True if the peice state is dead.
  isDead() {
    return this.state === PieceState.DEAD;
  }

  // True if the piece color is equal to the given color.
  isColor(color) {
    return this.color === color;
  }

  // True if the piece's move count is granther than 0.
  hasMoved() {
    return this.moveCount > 0;
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
      if (!this.player.isTurnOwner()) {
        return false;
      }
      event.emit(event.DRAGSTART, e, this);
      return false;
    });
    input.registerPointerEvent("pointerup", this, (e) => {
      // Only the turn owner may drop pieces.
      if (!this.player.isTurnOwner()) {
        return false;
      }
      event.emit(event.DRAGEND, e, this);
      return false;
    });
  }

  // Drag start event.
  dragStart(e) {
    if (!this.isDead() && !this.player.isPromotingPawn()) {
      // Hold the piece if it's not dead.
      this.setPieceState(PieceState.HELD);
      super.dragStart(e);
    } else if (
      this.player.isPromotingPawn() &&
      this.type !== PieceType.PAWN &&
      this.type !== PieceType.KING
    ) {
      // Promote a pawn to this piece's rank if it's clicked on.
      this.player.finishPawnPromotion(this.type);
      this.player.endTurn();
    }
  }

  // Drag end events.
  dragEnd(e) {
    if (!this.isDead()) {
      // Idle this piece if it's not dead.
      this.setPieceState(PieceState.IDLE);
      super.dragEnd(e);
    }
  }
}
