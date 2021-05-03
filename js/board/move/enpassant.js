game.Move.Enpassant = game.Move.extend({  
  // Init.
  init: function (from, to, enpassant) {
    this._super(game.Move, "init", [
      from, to, game.MoveType.ENPASSANT
    ]);
    this.enpassant = enpassant;
    this.target = this.enpassant.piece;
  }
});
