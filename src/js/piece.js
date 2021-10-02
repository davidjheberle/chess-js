import * as me from 'melonjs/dist/melonjs.module.js';

import { PieceType } from 'js/enums.js';
import Bishop from 'js/piece/behavior/bishop.js';
import King from 'js/piece/behavior/king.js';
import Knight from 'js/piece/behavior/knight.js';
import Pawn from 'js/piece/behavior/pawn.js';
import Queen from 'js/piece/behavior/queen.js';
import Rook from 'js/piece/behavior/rook.js';

// Piece state enum.
var PieceState = {
  IDLE: 0,
  HELD: 1,
  DEAD: 2
}
export { PieceState }

var Piece = me.DraggableEntity.extend({

  // Init.
  init: function (player, pieceType, pieceColor) {
    this._super(me.DraggableEntity, "init", [0, 0, {
      image: "pieces",
      width: 64,
      height: 64
    }]);
    this.player = player;
    this.offsetY = -20;
    this.moveCount = 0;
    this.setTypeAndColor(pieceType, pieceColor);
  },

  // Update.
  update: function (dt) {
    this._super(me.DraggableEntity, "update", [dt]);
    return true;
  },

  // Set this piece type and color.
  setTypeAndColor: function (type, color) {
    this.type = type;
    this.color = color;
    this.choosePieceImage(type, color);
    this.setBehavior(type);
  },

  // Load the piece image based on the piece type and color.
  choosePieceImage: function (type, color) {
    // Type and frame enum int values match sprite sheet frames.
    var frame = type * 2 + color;
    this.renderable.addAnimation("idle", [frame], 1);
    this.renderable.setCurrentAnimation("idle");
  },

  // Set the behavior of the piece.
  setBehavior: function (type) {
    switch (type) {
      case PieceType.PAWN:
        this.behavior = new Pawn(this);
        break;

      case PieceType.ROOK:
        this.behavior = new Rook(this);
        break;

      case PieceType.KNIGHT:
        this.behavior = new Knight(this);
        break;

      case PieceType.BISHOP:
        this.behavior = new Bishop(this);
        break;

      case PieceType.QUEEN:
        this.behavior = new Queen(this);
        break;

      case PieceType.KING:
        this.behavior = new King(this);
        break;
    }
  },

  // Set piece state.
  setPieceState: function (state) {
    var prevState = this.state;
    this.state = state;
    switch (this.state) {
      case PieceState.IDLE:
        // If the piece was held and is now idle.
        if (prevState == PieceState.HELD) {
          // Place it on the nearest space.
          var closestSquare = this.player.board.getClosestSquare(
            this.pos.x - ((this.square.width - this.width) / 2),
            this.pos.y - (((this.square.height - this.height) / 2) + this.offsetY));

          this.behavior.moveToSquare(closestSquare);
        }
        break;

      case PieceState.HELD:
        // Piece has been picked up.
        this.pos.z = 50;
        me.game.world.sort(true);
        break;

      case PieceState.DEAD:
        // Send this piece to its player's graveyard.
        this.player.graveyard.addPiece(this);
        break;
    }
  },

  // True if the piece state is held.
  isHeld: function () {
    return this.state == PieceState.HELD;
  },

  // True if the peice state is dead.
  isDead: function () {
    return this.state == PieceState.DEAD;
  },

  // True if the piece color is equal to the given color.
  isColor: function (color) {
    return this.color == color;
  },

  // True if the piece's move count is granther than 0.
  hasMoved: function () {
    return this.moveCount > 0;
  },

  // Init events including input events.
  initEvents: function () {
    this._super(me.DraggableEntity, "initEvents");

    // Remove the old pointerdown and pointerup events.
    this.removePointerEvent("pointerdown", this);
    this.removePointerEvent("pointerup", this);

    // Define the new events that return false (don't fall through).
    this.mouseDown = function (e) {

      // Don't allow mouse down when dead.
      if (!this.player.isTurnOwner()) {
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGSTART);
      return false;
    };
    this.mouseUp = function (e) {

      // Don't allow mouse up when dead.
      if (!this.player.isTurnOwner()) {
        return false;
      }
      this.translatePointerEvent(e, me.event.DRAGEND);
      return false;
    };

    // Add the new pointerdown and pointerup events.
    this.onPointerEvent("pointerdown", this, this.mouseDown.bind(this));
    this.onPointerEvent("pointerup", this, this.mouseUp.bind(this));
  },

  // Drag start event.
  dragStart: function (e) {
    if (!this.isDead() && !this.player.isPromotingPawn()) {
      // Hold the piece if it's not dead.
      this.setPieceState(PieceState.HELD);
      this._super(me.DraggableEntity, "dragStart", [e]);
    } else if (this.player.isPromotingPawn() &&
      this.type != PieceType.PAWN &&
      this.type != PieceType.KING) {
      // Promote a pawn to this piece's rank if it's clicked on.
      this.player.finishPawnPromotion(this.type);
      this.player.endTurn();
    }
  },

  // Drag end events.
  dragEnd: function (e) {
    if (!this.isDead()) {
      // Idle this piece if it's not dead.
      this.setPieceState(PieceState.IDLE);
      this._super(me.DraggableEntity, "dragEnd", [e]);
    }
  }
});

export default Piece;
