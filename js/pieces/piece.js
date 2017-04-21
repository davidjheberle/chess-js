game.PieceType = {
    PAWN : 0,
    ROOK : 1,
    KNIGHT : 2,
    BISHOP : 3,
    QUEEN : 4,
    KING : 5
}

game.PieceColor = {
    BLACK : 0,
    WHITE : 1
}

var _type;
var _color;

game.Piece = me.Entity.extend({
    init: function (pieceType, pieceColor) {
        this._super(me.Entity, "init", [0, 0, {
            image : "pieces",
            width : 64,
            height : 64
        }]);
        _type = pieceType;
        _color = pieceColor;
        this.choosePieceImage();
    },

    update: function (dt) {
        this._super(me.Entity, "update", [dt]);
        return true;
    },

    choosePieceImage: function () {
        // type and frame enum int values match sprite sheet frames.
        var frame = _type * 2 + _color;
        this.renderable.addAnimation("idle", [frame], 1);
        this.renderable.setCurrentAnimation("idle");
    },

    moveToSquare: function (square) {
        this.pos.x = square.pos.x + ((square.width - this.width) / 2);
        this.pos.y = square.pos.y + ((square.height - this.height) / 2) - 20;
        this.pos.z = square.row + 2;
    }
});
