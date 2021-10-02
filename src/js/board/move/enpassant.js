import Move from 'js/board/move.js';
import { MoveType } from 'js/enums.js'

var Enpassant = Move.extend({
  
  // Init.
  init: function (from, to, enpassant) {
    this._super(Move, "init", [
      from, to, MoveType.ENPASSANT
    ]);
    this.enpassant = enpassant;
    this.target = this.enpassant.piece;
  }
});

export default Enpassant;
