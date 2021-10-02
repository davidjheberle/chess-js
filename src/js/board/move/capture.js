import Move from 'js/board/move.js';
import { MoveType } from 'js/enums.js'

var Capture = Move.extend({
  
  // Init.
  init: function (from, to) {
    this._super(Move, "init", [
      from, to, MoveType.CAPTURE
    ]);
    this.to.threats.push(this.piece);
  }
});

export default Capture;
