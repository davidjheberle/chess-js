game.Move.Default = game.Move.extend({  
  // Init.
  init: function (from, to) {
    this._super(game.Move, "init", [
      from, to, game.MoveType.DEFAULT
    ]);
    this.to.threats.push(this.piece);
  }
});
