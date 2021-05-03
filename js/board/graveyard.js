game.Graveyard = me.Renderable.extend({
  // Init.
  init: function (x, y, width, height, rows, columns) {
    this.numRows = rows;
    this.numColumns = columns;
    this.borderPaddingX = 2;
    this.borderPaddingY = 2;

    // Array of graves.
    this.graves = [];
    this.graveIndex = 0;

    this._super(me.Renderable, "init", [x, y, width, height]);

    var grave;
    var graveWidth = width / this.numColumns;
    var graveHeight = height / this.numRows;
    var originX = -width / 2 + graveWidth / 2;
    var graveX = originX;
    var graveY = -this.height / 2 + graveHeight / 2;
    for (r = 0; r < this.numRows; ++r) {
      for (c = 0; c < this.numColumns; ++c) {
        grave = new game.Grave(this.pos.x + graveX, this.pos.y + graveY, graveWidth, graveHeight, '#aaa', r, c);
        me.game.world.addChild(grave, 1);
        this.graves.push(grave);
        graveX += graveWidth;
      }
      graveY += graveHeight;
      graveX = originX;
    }
  },

  // Update.
  update: function (dt) {
    this._super(me.Renderable, "update", [dt]);
    return true;
  },

  // Draw.
  draw: function (renderer) {
    renderer.setColor('#444');
    renderer.fillRect(
      this.pos.x + this.borderPaddingX,
      this.pos.y + this.borderPaddingY,
      this.width - this.borderPaddingX * 2,
      this.height - this.borderPaddingY * 2);
  },

  // Add a piece to the graveyard.
  addPiece: function (piece) {
    // Get the next open space and add this piece there.
    if (this.graveIndex >= this.graves.length) {
      return;
    }

    // Add piece to the grave.
    this.graves[this.graveIndex].addPiece(piece);

    // Increment grave index.
    this.graveIndex++;
  },

  // True if graveyard is empty.
  isEmpty: function () {
    return this.graveIndex == 0;
  }
});
