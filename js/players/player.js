game.Player = me.Entity.extend({
  // Init.
  init: function(color, direction, board) {
    this._super(me.Entity, "init", [0, 0, {
      width: 0,
      height: 0
    }]);
    this.color = color;
    this.direction = direction;
    this.board = board;
    this.pawnToPromote = null;

    var graveyardX;
    switch (this.direction) {
      case game.PieceDirection.UP:
        graveyardX = 520;
        break;

      default:
        graveyardX = 40;
        break;
    }
    this.graveyard = new game.Graveyard(graveyardX, 80, 80, 320, 8, 2);
    me.game.world.addChild(this.graveyard, 0);

    this.setPieces();
  },

  // Set pieces on the game board.
  setPieces: function() {
    var nobleRow;
    var pawnRow;
    switch (this.direction) {
      case game.PieceDirection.UP:
        nobleRow = 7;
        pawnRow = nobleRow - 1;
        break;

      case game.PieceDirection.DOWN:
        nobleRow = 0;
        pawnRow = nobleRow + 1;
        break;
    }

    piece = new game.Piece(this, game.PieceType.ROOK, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 0));

    piece = new game.Piece(this, game.PieceType.KNIGHT, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 1));

    piece = new game.Piece(this, game.PieceType.BISHOP, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 2));

    piece = new game.Piece(this, game.PieceType.QUEEN, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 3));

    piece = new game.Piece(this, game.PieceType.KING, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 4));

    piece = new game.Piece(this, game.PieceType.BISHOP, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 5));

    piece = new game.Piece(this, game.PieceType.KNIGHT, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 6));

    piece = new game.Piece(this, game.PieceType.ROOK, this.color);
    me.game.world.addChild(piece);
    piece.behavior.setToSquare(this.board.getSquare(nobleRow, 7));

    for (i = 0; i < 8; i++) {
      piece = new game.Piece(this, game.PieceType.PAWN, this.color);
      me.game.world.addChild(piece);
      piece.behavior.setToSquare(this.board.getSquare(pawnRow, i));
    }
  },

  // True if it's this player's turn.
  isTurnOwner: function() {
    return this.color == this.board.turnOwner;
  },

  // End this player's turn.
  endTurn: function() {
    this.board.switchTurnOwner();
  },

  // True if player is sacrificing a piece.
  isSacrificingPiece: function() {
    return this.sacrificialPiece != null;
  },

  // Start the pawn promotion.
  startPawnPromotion: function(pawnToPromote) {
    this.pawnToPromote = pawnToPromote;
  },

  // Finish the pawn promotion.
  finishPawnPromotion: function(promotionRank) {
    // Set the pawn's new type.
    this.pawnToPromote.setTypeAndColor(promotionRank, this.color);

    // Clean up.
    this.pawnToPromote = null;
  },

  // Return true if pawn to promote is not null.
  isPromotingPawn: function() {
    return this.pawnToPromote != null;
  }
});
