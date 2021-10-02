import * as me from 'melonjs/dist/melonjs.module.js';

var Move = me.Entity.extend({
  
  // Init.
  init: function (from, to, type) {
    this._super(me.Entity, "init", [0, 0, {
      width: 0,
      height: 0
    }]);
    this.from = from;
    this.to = to;
    this.type = type;
    this.piece = this.from.piece;
    this.target = this.to.piece;
  },

  // Equals function.
  equals: function (move) {
    return this.to.equals(move.to) && this.from.equals(move.from);
  }
});

export default Move;
