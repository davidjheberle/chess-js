game.Move.Castle = game.Move.extend({  
  // Init.
  init: function (from, to, rookFrom, rookTo) {
    this._super(game.Move, "init", [
      from, to, game.MoveType.CASTLE
    ]);
    this.rookFrom = rookFrom;
    this.rookTo = rookTo;
    this.target = this.rookFrom.piece;
  }
});
