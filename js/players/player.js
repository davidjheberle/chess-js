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

    piece = new game.Rook(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 0));

    piece = new game.Knight(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 1));

    piece = new game.Bishop(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 2));

    piece = new game.Queen(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 3));

    piece = new game.King(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 4));

    piece = new game.Bishop(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 5));

    piece = new game.Knight(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 6));

    piece = new game.Rook(this, this.color);
    me.game.world.addChild(piece);
    piece.setToSquare(this.board.getSquare(nobleRow, 7));

    for (i = 0; i < 8; i++) {
      piece = new game.Pawn(this, this.color);
      me.game.world.addChild(piece);
      piece.setToSquare(this.board.getSquare(pawnRow, i));
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
    var square = this.pawnToPromote.square;

    // Remove the pawn from the square.
    square.piece = null;

    // Copy the information from the pawn to promote into a new piece of the
    // designated rank.
    var piece;
    switch (promotionRank) {
      case game.PieceType.ROOK:
        piece = new game.Rook(this, this.color);
        break;

      case game.PieceType.KNIGHT:
        piece = new game.Knight(this, this.color);
        break;

      case game.PieceType.BISHOP:
        piece = new game.Bishop(this, this.color);
        break;

      case game.PieceType.QUEEN:
        piece = new game.Queen(this, this.color);
        break;
    }
    me.game.world.addChild(piece);
    piece.setToSquare(square);

    // Perminantly remove the pawn.
    me.game.world.removeChild(this.pawnToPromote);

    // Clean up.
    this.pawnToPromote = null;
  },

  // Return true if pawn to promote is not null.
  isPromotingPawn: function() {
    return this.pawnToPromote != null;
  }
});
