game.Grave = me.Entity.extend({
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
      this.pos.x + 2,
      this.pos.y + 2,
      this.width - 4, this.height - 4);
  },

  isOccupied: function() {
    return this.piece != null;
  },

  isLocatedAt: function(c, r) {
    return this.row === r && this.column === c;
  },

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
