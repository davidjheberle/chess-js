game.Grave = me.Renderable.extend({
  // Init.
  init: function(x, y, width, height, color, row, column) {
    // x, y, width, height
    this._super(me.Renderable, "init", [x, y, width, height]);
    this.color = color;
    this.row = row;
    this.column = column;
    this.piece = null;
    this.borderPaddingX = 2;
    this.borderPaddingY = 2;
  },

  // Update.
  update: function() {
    return false;
  },

  // Draw.
  draw: function(renderer) {
    renderer.setColor('#444');
    renderer.fillRect(
      this.pos.x,
      this.pos.y,
      this.width, this.height);
    renderer.setColor(this.color);
    renderer.fillRect(
      this.pos.x + this.borderPaddingX,
      this.pos.y + this.borderPaddingY,
      this.width - this.borderPaddingX * 2,
      this.height - this.borderPaddingY * 2);
  },

  // True if occupied.
  isOccupied: function() {
    return this.piece != null;
  },

  // True if located at column, row.
  isLocatedAt: function(c, r) {
    return this.row === r && this.column === c;
  },

  // Add the specified piece.
  addPiece: function(piece) {
    if (this.isOccupied() == true) {
      return;
    }
    piece.pos.x = this.pos.x + ((this.width - piece.width) / 2);
    piece.pos.y = this.pos.y + (((this.height - piece.height) / 2) + piece.offsetY);
    piece.pos.z = this.row + 2;
    piece.square = null;
    this.piece = piece;
    me.game.world.sort(true);
  }
});
