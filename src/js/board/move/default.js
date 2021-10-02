import Move from 'js/board/move.js';
import { MoveType } from 'js/enums.js'

var Default = Move.extend({

  // Init.
  init: function (from, to) {
    this._super(Move, "init", [
      from, to, MoveType.DEFAULT
    ]);
    this.to.threats.push(this.piece);
  }
});

export default Default;
