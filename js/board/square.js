game.Square = me.Entity.extend({
  // Init.
  init: function(x, y, width, height, color, row, column) {
    // position, width, height
    this._super(me.Entity, "init", [x, y, {
      width: width,
      height: height
    }]);
    this.color = color;
    this.row = row;
    this.column = column;
    this.piece = null;
  },

  // Draw.
  draw: function(renderer) {
    renderer.setColor(this.color);
    renderer.fillRect(
      this.pos.x,
      this.pos.y,
      this.width, this.height);
  },

  // Update.
  update: function() {
    return false;
  },

  // Return true if this square is occupied by a piece.
  isOccupied: function() {
    return this.piece != null;
  },

  // Return true if the square is located at the specified column and row.
  isLocatedAt: function(c, r) {
    return this.row === r && this.column === c;
  }
});
