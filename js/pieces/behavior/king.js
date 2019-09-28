game.Behavior.King = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Return array of valid destination squares.
  getValidSquares: function() {
    var validSquares = [];
    var adjacentSquare;

    // right
    adjacentSquare = this.getAdjacentSquare(1, 0);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // left
    adjacentSquare = this.getAdjacentSquare(-1, 0);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // up
    adjacentSquare = this.getAdjacentSquare(0, -1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // down
    adjacentSquare = this.getAdjacentSquare(0, 1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }

    // up left
    adjacentSquare = this.getAdjacentSquare(-1, -1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // down left
    adjacentSquare = this.getAdjacentSquare(-1, 1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // up right
    adjacentSquare = this.getAdjacentSquare(1, -1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // down right
    adjacentSquare = this.getAdjacentSquare(1, 1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }

    // castle to column 0
    if (this.canCastleTo(0)) {

    }

    // castle to column 7
    if (this.canCastleTo(7)) {

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
      console.log("King has moved.");
      return false;
    }

    // Return false if the king is in check.

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
        console.log("Space at column " + checkColumn + " is occupied.");
        return false;
      }
      checkColumn += checkDirection;
    }

    // Return false if any of the spaces the king must step on put it in check.
    console.log("true");
    return true;
  }
});
