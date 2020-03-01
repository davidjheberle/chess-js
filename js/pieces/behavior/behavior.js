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
      var board = this.piece.player.board;

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
      } else {
        // Check for en-passant pawn.
        if (square.isOnRank(6, this.piece.player.direction)) {
          var enPassantSquare;
          switch (this.piece.player.direction) {
            case game.PieceDirection.UP:
              enPassantSquare = board.getSquare(square.row + 1, square.column);
              break;

            case game.PieceDirection.DOWN:
              enPassantSquare = board.getSquare(square.row - 1, square.column);
              break;
          }
          if (enPassantSquare != null &&
            enPassantSquare.isOccupied() &&
            !enPassantSquare.piece.isColor(this.piece.color) &&
            enPassantSquare.piece.type == game.PieceType.PAWN &&
            enPassantSquare.piece.sinceMove == 0) {
            enPassantSquare.piece.setPieceState(game.PieceState.DEAD);
          }
        }

        // Check for castling.
        // 2 squares towards the rook.
        // Rook to the square the king crossed.
        var castleDifference = square.column - this.piece.square.column;
        if (this.piece.type == game.PieceType.KING &&
          Math.abs(castleDifference) == 2) {
          var castleDirection = castleDifference < 0 ? -1 : 1;
          var rookFromColumn;
          switch (castleDirection) {
            // castling to the left
            case -1:
              rookFromColumn = 0;
              break;


            // castling to the right
            case 1:
              rookFromColumn = 7;
              break;
          }
          var rookToSquare = board.getSquare(square.row, square.column - castleDirection);
          var rookFromSquare = board.getSquare(square.row, rookFromColumn);

          if (rookFromSquare.isOccupied() &&
            rookFromSquare.piece.isColor(this.piece.color) &&
            rookFromSquare.piece.type == game.PieceType.ROOK) {

            // Move the rook.
            rookFromSquare.piece.behavior.positionOnSquare(rookToSquare);
            rookFromSquare.piece = null;
          }
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
      this.piece.moveCount++;
      this.piece.sinceMove = 0;
    }
    this.piece.pos.x = square.pos.x - this.piece.width / 2;
    this.piece.pos.y = square.pos.y - this.piece.height / 2 + this.piece.offsetY;
    this.piece.pos.z = square.row + 2;
    this.piece.square = square;
    this.piece.square.piece = this.piece;
    me.game.world.sort(true);
  },

  // Check if the move is valid.
  isMoveValid: function(square) {
    return this.getValidDestinations().includes(square);
  },

  // Return array of valid capture squares.
  getValidCaptures: function() {
    // override
    return [];
  },

  // Return array of valid destination squares.
  getValidDestinations: function() {
    // override
    return [];
  },

  // Return array of vulnerable pieces.
  getVulnerablePieces: function() {
    var vulnerablePieces = [];
    var validSquares = this.getValidCaptures();
    for (i = 0; i < validSquares.length; i++) {
      piece = validSquares[i].piece;
      if (piece != null) {
        vulnerablePieces.push(piece)
      }
    }
    return vulnerablePieces;
  }
});
