game.Square = me.Renderable.extend({
  // Init.
  init: function (x, y, width, height, color, row, column) {
    // x, y, width, height
    this._super(me.Renderable, "init", [x, y, width, height]);
    this.color = color;
    this.row = row;
    this.column = column;
    this.piece = null;
    this.threats = [];
  },

  // Draw.
  draw: function (renderer) {
    renderer.setColor(this.color);
    renderer.fillRect(
      this.pos.x,
      this.pos.y,
      this.width, this.height);
  },

  // Update.
  update: function () {
    return false;
  },

  // Return true if this square is occupied by a piece.
  isOccupied: function () {
    return this.piece != null;
  },

  // Return true if the square is located at the specified column and row.
  isLocatedAt: function (c, r) {
    return this.row === r && this.column === c;
  },

  // Check the square's rank based on color.
  isOnRank: function (rank, color) {
    switch (color) {
      case game.PieceColor.WHITE:
        // Check if the current space's row is 8 - rank.
        return this.row === 8 - rank;

      case game.PieceColor.BLACK:
        // Check if the current space's row is rank - 1.
        return this.row === rank - 1;
    }
    return false;
  },

  // Return true if the provided color is threatened on this square.
  isThreatened: function (color) {
    return this.threats.filter(function (t) {
      return t.color != color;
    }).length > 0;
  },

  // Equals function.
  equals: function (square) {
    return this.row === square.row && this.column === square.column;
  }
});
