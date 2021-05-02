game.Board = me.Renderable.extend({
  // Init.
  init: function () {
    this.turnOwner = game.PieceColor.BLACK;
    this.borderPaddingX = 4;
    this.borderPaddingY = 4;

    // 2d array of squares [row, column].
    this.squares = [];

    // x, y, width, height
    this._super(me.Renderable, "init", [
      me.game.viewport.width / 2,
      me.game.viewport.height / 2,
      320,
      320
    ]);

    var square;
    var squareWidth = this.width / 8;
    var squareHeight = this.height / 8;
    var originX = -this.width / 2 + squareWidth / 2;
    var squareX = originX;
    var squareY = -this.height / 2 + squareHeight / 2;
    var squareColor;
    for (r = 0; r < 8; ++r) {
      this.squares.push([]);
      for (c = 0; c < 8; ++c) {
        if (((r + c) % 2) == 0) {
          squareColor = '#fff';
        } else {
          squareColor = '#000';
        }
        square = new game.Square(this.pos.x + squareX, this.pos.y + squareY, squareWidth, squareHeight, squareColor, r, c);
        me.game.world.addChild(square, 1);
        this.squares[r].push(square);
        squareX += squareWidth;
      }
      squareY += squareHeight;
      squareX = originX;
    }

    // Create 2 players and have them set up their pieces.
    this.player1 = new game.Player(game.PieceColor.WHITE, this);
    this.player2 = new game.Player(game.PieceColor.BLACK, this);

    this.switchTurnOwner();
  },

  // Update.
  update: function (dt) {
    this._super(me.Renderable, "update", [dt]);
    return true;
  },

  // Draw.
  draw: function (renderer) {
    renderer.setColor('#444');
    renderer.fillRect(
      this.pos.x - this.borderPaddingX,
      this.pos.y - this.borderPaddingY,
      this.width + this.borderPaddingX * 2,
      this.height + this.borderPaddingY * 2);
  },

  // Get sqaure at row, column.
  getSquare: function (r, c) {
    if (r < 0 || c < 0) {
      return null;
    }
    if (r >= this.squares.length) {
      return null;
    }
    if (c >= this.squares[r].length) {
      return null;
    }
    return this.squares[r][c];
  },

  // Get closest square to x, y position.
  getClosestSquare: function (x, y) {
    var closestX = Number.POSITIVE_INFINITY;
    var closestY = Number.POSITIVE_INFINITY;
    var closestR = -1;
    var closestC = -1;
    var workX;
    var workY;
    for (i = 0; i < this.squares.length; ++i) {
      workX = Math.abs(x - this.squares[0][i].pos.x + this.squares[0][i].width / 2);
      if (workX < closestX) {
        closestX = workX;
        closestC = i;
      }

      workY = Math.abs(y - this.squares[i][0].pos.y + this.squares[i][0].height / 2);
      if (workY < closestY) {
        closestY = workY;
        closestR = i;
      }
    }
    return this.getSquare(closestR, closestC);
  },

  // Switch the turn owner.
  switchTurnOwner: function () {
    switch (this.turnOwner) {
      case game.PieceColor.WHITE:
        this.turnOwner = game.PieceColor.BLACK;
        this.player2.startTurn();
        this.calculateMoves();
        break;

      case game.PieceColor.BLACK:
        this.turnOwner = game.PieceColor.WHITE;
        this.player1.startTurn();
        this.calculateMoves();
        break;
    }
  },

  // Calculate all possible moves.
  calculateMoves : function () {
    var piece;
    var pieces = [];
    for (var r = 0; r < this.squares.length; ++r) {
      for (var c = 0; c < this.squares[r].length; ++c) {
        this.squares[r][c].threats = [];
        piece = this.squares[r][c].piece;
        if (piece != null) {
          pieces.push(piece);
        }
      }
    }
    pieces.forEach(function (p, i) {
      p.behavior.calculateMoves();
    });
    pieces.forEach(function (p, i) {
      p.behavior.pruneMoves();
    });
  }
});
