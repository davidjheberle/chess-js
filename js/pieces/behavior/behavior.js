game.Behavior = me.Entity.extend({
  // Init.
  init: function(piece) {
    this._super(me.Entity, "init", [0, 0, {
      width: 0,
      height: 0
    }]);
    this.piece = piece;
  },

  // Set to the specified square to start the game.
  // Return true if piece was successfully set.
  setToSquare: function(square) {
    // If this piece has been set on the board already.
    if (this.piece.square) {
      // Check if the next board position leaves the king exposed.

      // Check if valid based on piece type and color.
      if (!this.isMoveValid(square)) {
        this.moveBack();
        return false;
      }
      if (square.isOccupied()) {
        if (!square.piece.isColor(this.piece.color)) {
          // Take the occupying piece.
          square.piece.setPieceState(game.PieceState.DEAD);
        }
      }

      // Leave the previous square.
      this.piece.square.piece = null;
    }
    this.positionOnSquare(square);
    return true;
  },

  // Move to the specified square.
  moveToSquare: function(square) {
    // Set to the square.
    if (this.setToSquare(square)) {
      // Finish the movement.
      this.finishMove();
    }
  },

  // Finish moving.
  finishMove: function() {
    this.piece.player.endTurn();
  },

  // Move back to the occupied square.
  moveBack: function() {
    this.positionOnSquare(this.piece.square);
  },

  // Position this piece on the given square.
  positionOnSquare: function(square) {
    if (this.piece.square != null &&
      this.piece.square != square) {
      this.piece.hasMoved = true;
    }
    this.piece.pos.x = square.pos.x + ((square.width - this.piece.width) / 2);
    this.piece.pos.y = square.pos.y + (((square.height - this.piece.height) / 2) + this.piece.offsetY);
    this.piece.pos.z = square.row + 2;
    this.piece.square = square;
    this.piece.square.piece = this.piece;
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
  }
});
