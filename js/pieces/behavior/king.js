game.Behavior.King = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Return array of valid capture squares.
  getValidCaptures: function() {
    var validSquares = [];
    var targetSquare;

    // right
    targetSquare = this.getAdjacentSquare(1, 0);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    // left
    targetSquare = this.getAdjacentSquare(-1, 0);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    // up
    targetSquare = this.getAdjacentSquare(0, -1);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    // down
    targetSquare = this.getAdjacentSquare(0, 1);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }

    // up left
    targetSquare = this.getAdjacentSquare(-1, -1);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    // down left
    targetSquare = this.getAdjacentSquare(-1, 1);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    // up right
    targetSquare = this.getAdjacentSquare(1, -1);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    // down right
    targetSquare = this.getAdjacentSquare(1, 1);
    if (targetSquare != null) {
      validSquares.push(targetSquare);
    }
    return validSquares;
  },

  // Return array of valid destination squares.
  getValidDestinations: function() {
    var board = this.piece.player.board;
    var validSquares = this.getValidCaptures();
    var targetSquare;

    // castle to column 0
    if (this.canCastleTo(0)) {
      targetSquare = board.getSquare(this.piece.square.row, this.piece.square.column - 2);
      validSquares.push(targetSquare);
    }
    // castle to column 7
    if (this.canCastleTo(7)) {
      targetSquare = board.getSquare(this.piece.square.row, this.piece.square.column + 2);
      validSquares.push(targetSquare);
    }
    return validSquares;
  },

  // Return array of adjacent squares.
  getAdjacentSquare: function(horizontal, vertical) {
    if (Math.abs(horizontal) > 1 || Math.abs(vertical) > 1) {
      return null;
    }
    var r = this.piece.square.row + vertical;
    var c = this.piece.square.column + horizontal;
    var adjacentSquare = this.piece.player.board.getSquare(r, c);
    if (adjacentSquare == null) {
      return null;
    }
    if (adjacentSquare.isOccupied()) {
      if (adjacentSquare.piece.color != this.piece.color) {
        return adjacentSquare;
      }
    } else {
      return adjacentSquare;
    }
    return null;
  },

  canCastleTo: function(column) {
    // Calculate the direction that must be checked later on.
    // Assert column was recieved correctly.
    var checkDirection;
    if (column == 7) {
      checkDirection = 1;
    } else if (column == 0) {
      checkDirection = -1;
    } else {
      console.error("column is " + column + ", it must be 7 or 0.");
    }

    // Return false if the king has moved.
    if (this.piece.moveCount != 0) {
      return false;
    }

    // Return false if the king is in check.
    if (this.piece.isPieceVulnerable()) {
      return false;
    }

    var board = this.piece.player.board;
    var rookSquare = board.getSquare(this.piece.square.row, column);

    // Return false if the rook square is not occupied.
    if (!rookSquare.isOccupied()) {
      console.log("Rook square is empty.");
      return false;
    }

    // Return false if the rook square isn't occupied by a rook.
    if (rookSquare.piece.type != game.PieceType.ROOK) {
      console.log("Piece in rook square is not rook.");
      return false;
    }

    // Return false if the rook has moved.
    if (rookSquare.piece.moveCount != 0) {
      console.log("Rook has moved.");
      return false;
    }

    // Return false if any of the squares between the rook and the king are occupied.
    var checkColumn = this.piece.square.column;
    var checkRow = this.piece.square.row;
    var checkSquare;
    checkColumn += checkDirection;
    while (checkColumn != column) {
      checkSquare = board.getSquare(checkRow, checkColumn);
      if (checkSquare.isOccupied()) {
        return false;
      }
      checkColumn += checkDirection;
    }

    // Return false if any of the spaces the king must step on put it in check.
    // TODO
    return true;
  }
});
