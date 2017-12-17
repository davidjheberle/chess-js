// Piece state enum.
game.PieceState = {
  IDLE: 0,
  HELD: 1,
  DEAD: 2
}

game.Piece = me.DraggableEntity.extend({
  // Init.
  init: function(player, pieceType, pieceColor) {
    this._super(me.DraggableEntity, "init", [0, 0, {
      image: "pieces",
      width: 64,
      height: 64
    }]);
    this.player = player;
    this.type = pieceType;
    this.color = pieceColor;
    this.offsetY = -20;
    this.choosePieceImage();
    this.hasMoved = false;
  },

  // Update.
  update: function(dt) {
    this._super(me.DraggableEntity, "update", [dt]);
    return true;
  },

  // Load the piece image based on the piece type and color.
  choosePieceImage: function() {
    // Type and frame enum int values match sprite sheet frames.
    var frame = this.type * 2 + this.color;
    this.renderable.addAnimation("idle", [frame], 1);
    this.renderable.setCurrentAnimation("idle");
  },

  moveToSquare: function(square) {
    // If this piece has been set on the board already.
    if (this.square) {
      // Check if the next board position leaves the king exposed.

      // Check if valid based on piece type and color.
      if (!this.isMoveValid(square)) {
        this.moveBack();
        return;
      }
      if (square.isOccupied()) {
        if (!square.piece.isColor(this.color)) {
          // Take the occupying piece.
          square.piece.setPieceState(game.PieceState.DEAD);
        }
      }

      // leave the previous square.
      this.square.piece = null;
    }
    this.positionOnSquare(square);
    this.player.endTurn();
  },

  // Move back to the occupied square.
  moveBack: function() {
    this.positionOnSquare(this.square);
  },

  // Position this piece on the given square.
  positionOnSquare: function(square) {
    if (this.square != null &&
      this.square != square) {
      this.hasMoved = true;
    }
    this.pos.x = square.pos.x + ((square.width - this.width) / 2);
    this.pos.y = square.pos.y + (((square.height - this.height) / 2) + this.offsetY);
    this.pos.z = square.row + 2;
    this.square = square;
    this.square.piece = this;
    me.game.world.sort(true);
  },

  // Check if the move is valid.
  isMoveValid: function(square) {
    return this.getValidSquares().includes(square);
  },

  // Return array of valid destination squares.
  getValidSquares: function() {
    // override
    return [];
  },

  // Set piece state.
  setPieceState: function(state) {
    var prevState = this.state;
    this.state = state;
    switch (this.state) {
      case game.PieceState.IDLE:
        // If the piece was held and is now idle.
        if (prevState == game.PieceState.HELD) {
          // Place it on the nearest space.
          var closestSquare = this.player.board.getClosestSquare(
            this.pos.x - ((this.square.width - this.width) / 2),
            this.pos.y - (((this.square.height - this.height) / 2) + this.offsetY));

          this.moveToSquare(closestSquare);
        }
        break;

      case game.PieceState.HELD:
        // Piece has been picked up.
        this.pos.z = 50;
        me.game.world.sort(true);
        break;

      case game.PieceState.DEAD:
        // Send this piece to its player's graveyard.
        this.player.putPieceInGraveyard(this);
        break;

      default:
        break;
    }
  },

  // True if the piece state is held.
  isHeld: function() {
    return this.state == game.PieceState.HELD;
  },

  // True if the peice state is dead.
  isDead: function() {
    return this.state == game.PieceState.DEAD;
  },

  // True if the piece color is equal to the given color.
  isColor: function(color) {
    return this.color == color;
  },

  // Init events including input events.
  initEvents: function() {
    this._super(me.DraggableEntity, "initEvents");

    // Remove the old pointerdown and pointerup events.
    this.removePointerEvent("pointerdown", this);
    this.removePointerEvent("pointerup", this);

    // Define the new events that return false (don't fall through).
    this.mouseDown = function(e) {

      // Don't allow mouse down when dead.
      if (this.isDead() || !this.player.isTurnOwner()) {
        return false;
      }

      this.translatePointerEvent(e, me.event.DRAGSTART);
      return false;
    };
    this.mouseUp = function(e) {

      // Don't allow mouse up when dead.
      if (this.isDead() || !this.player.isTurnOwner()) {
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
  dragStart: function(e) {
    if (!this.isDead()) {
      this._super(me.DraggableEntity, "dragStart", [e]);
      this.setPieceState(game.PieceState.HELD);
    }
  },

  // Drag end events.
  dragEnd: function(e) {
    this._super(me.DraggableEntity, "dragEnd", [e]);
    this.setPieceState(game.PieceState.IDLE);
  }
});
