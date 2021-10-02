import * as me from 'melonjs/dist/melonjs.module.js';

import { MoveType } from 'js/enums.js'
import { PieceState } from 'js/piece.js'

var Behavior = me.Entity.extend({

  // Init.
  init: function (piece) {
    this._super(me.Entity, "init", [0, 0, {
      width: 0,
      height: 0
    }]);
    this.piece = piece;
    this.moves = [];
  },

  // Move to the specified square.
  moveToSquare: function (square) {
    var move = this.getMove(square);
    if (move != null) {
      this.performMove(move);
      this.finishMove();
    } else {
      this.moveBack();
    }
  },

  // Perform a move.
  performMove: function (move) {
    switch (move.type) {
      case MoveType.CASTLE:
        // Move the rook.
        m.target.behavior.positionOnSquare(m.rookTo);
        m.rookFrom.piece = null;
        break;

      default:
        if (move.target != null) {
          move.target.setPieceState(PieceState.DEAD);
        }
    }

    // Leave the previous square.
    move.from.piece = null;

    // Go to the next square.
    this.positionOnSquare(move.to);
  },

  // Finish moving.
  finishMove: function () {
    this.piece.player.endTurn();
  },

  // Move back to the occupied square.
  moveBack: function () {
    this.positionOnSquare(this.piece.square);
  },

  // Position this piece on the given square.
  positionOnSquare: function (square) {
    if (this.piece.square != null &&
      this.piece.square != square) {
      this.piece.moveCount++;
      this.piece.sinceMove = 0;
    }
    this.piece.pos.x = square.pos.x - this.piece.width / 2;
    this.piece.pos.y = square.pos.y - this.piece.height / 2 + this.piece.offsetY;
    this.piece.pos.z = square.row + 2;
    this.piece.square = square;
    this.piece.square.piece = this.piece;
    me.game.world.sort(true);
  },

  // Get move based on its 'to' square.
  getMove: function (toSquare) {
    return this.moves.find(function (m) {
      return m.to.equals(toSquare);
    });
  },

  // Calculate possible moves.
  calculateMoves: function () {
    // override
    this.moves = [];
  },

  // Prune invalid moves.
  pruneMoves: function () {
    var valid = [];
    this.moves.forEach(function (m, i) {
      if (m.target == null ||
        m.target.color != m.piece.color) {
        valid.push(m);
      }
    });
    this.moves = valid;
  }
});

export default Behavior;
