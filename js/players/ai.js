game.AI = game.Player.extend({
  // Init.
  init: function(color, direction, board) {
    this._super(game.Player, "init", [
      color,
      direction,
      board
    ]);
  }
});
