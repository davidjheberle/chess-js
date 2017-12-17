game.AI = game.Player.extend({
  init: function(color, direction, board) {
    this._super(game.Player, "init", [
      color,
      direction,
      board
    ]);
  }
});
