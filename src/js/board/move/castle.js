import Move from 'js/board/move.js';
import { MoveType } from 'js/enums.js'

var Castle = Move.extend({

  // Init.
  init: function (from, to, rookFrom, rookTo) {
    this._super(Move, "init", [
      from, to, MoveType.CASTLE
    ]);
    this.rookFrom = rookFrom;
    this.rookTo = rookTo;
    this.target = this.rookFrom.piece;
  }
});

export default Castle;
