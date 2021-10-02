import * as me from 'melonjs/dist/melonjs.module.js';

import Graveyard from 'js/board/graveyard.js';
import { PieceColor, PieceType } from 'js/enums.js';
import Piece from 'js/piece.js';

var Player = me.Entity.extend({
  // Init.
  init: function (color, board) {
    this._super(me.Entity, "init", [0, 0, {
      width: 0,
      height: 0
    }]);
    this.color = color;
    this.board = board;
    this.pawnToPromote = null;

    var graveyardX;
    switch (this.color) {
      case PieceColor.WHITE:
        me.game.viewport.height / 2,
          graveyardX = me.game.viewport.width / 2 + 240;
        break;

      default:
        graveyardX = me.game.viewport.width / 2 - 240;
        break;
    }
    this.graveyard = new Graveyard(graveyardX, me.game.viewport.height / 2, 80, 320, 8, 2);
    me.game.world.addChild(this.graveyard, 0);

    this.setPieces();
  },

  // Set pieces on the game board.
  setPieces: function () {
    var nobleRow;
    var pawnRow;
    switch (this.color) {
      case PieceColor.WHITE:
        nobleRow = 7;
        pawnRow = nobleRow - 1;
        break;

      case PieceColor.BLACK:
        nobleRow = 0;
        pawnRow = nobleRow + 1;
        break;
    }

    var piece;
    
    piece = new Piece(this, PieceType.ROOK, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 0));

    piece = new Piece(this, PieceType.KNIGHT, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 1));

    piece = new Piece(this, PieceType.BISHOP, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 2));

    piece = new Piece(this, PieceType.QUEEN, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 3));

    piece = new Piece(this, PieceType.KING, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 4));

    piece = new Piece(this, PieceType.BISHOP, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 5));

    piece = new Piece(this, PieceType.KNIGHT, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 6));

    piece = new Piece(this, PieceType.ROOK, this.color);
    me.game.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(nobleRow, 7));

    for (var i = 0; i < 8; ++i) {
      piece = new Piece(this, PieceType.PAWN, this.color);
      me.game.world.addChild(piece);
      piece.behavior.positionOnSquare(this.board.getSquare(pawnRow, i));
    }
  },

  // True if it's this player's turn.
  isTurnOwner: function () {
    return this.color == this.board.turnOwner;
  },

  // Start this player's turn.
  startTurn: function () {
    for (var i = 0; i < this.board.squares.length; ++i) {
      var rows = this.board.squares[i];
      for (var j = 0; j < rows.length; j++) {
        var square = rows[j];
        if (square.isOccupied() &&
          square.piece.isColor(this.color)) {
          square.piece.sinceMove++;
        }
      }
    }
  },

  // End this player's turn.
  endTurn: function () {
    this.board.switchTurnOwner();
  },

  // Start the pawn promotion.
  startPawnPromotion: function (pawnToPromote) {
    this.pawnToPromote = pawnToPromote;
  },

  // Finish the pawn promotion.
  finishPawnPromotion: function (promotionRank) {
    // Set the pawn's new type.
    this.pawnToPromote.setTypeAndColor(promotionRank, this.color);

    // Clean up.
    this.pawnToPromote = null;
  },

  // Return true if pawn to promote is not null.
  isPromotingPawn: function () {
    return this.pawnToPromote != null;
  }
});

export default Player;
