game.Move.Capture = game.Move.extend({  
  // Init.
  init: function (from, to) {
    this._super(game.Move, "init", [
      from, to, game.MoveType.CAPTURE
    ]);
    this.to.threats.push(this.piece);
  }
});
