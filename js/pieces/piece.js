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

game.PieceState = {
    IDLE : 0,
    HELD : 1
}

game.Piece = me.DraggableEntity.extend({
    init: function (board, pieceType, pieceColor) {
        this._super(me.DraggableEntity, "init", [0, 0, {
            image : "pieces",
            width : 64,
            height : 64
        }]);
        this.board = board;
        this.type = pieceType;
        this.color = pieceColor;
        this.offsetY = -20;
        this.choosePieceImage();
    },

    update: function (dt) {
        this._super(me.DraggableEntity, "update", [dt]);
        return true;
    },

    choosePieceImage: function () {
        // type and frame enum int values match sprite sheet frames.
        var frame = this.type * 2 + this.color;
        this.renderable.addAnimation("idle", [frame], 1);
        this.renderable.setCurrentAnimation("idle");
    },

    moveToSquare: function (square) {
        // Check if this is a valid move.
        if (square.isOccupied() && square.piece != this) {
            return;
        }
        // Check if valid based on piece type and color.

        if (this.square != null) {
            // leave the previous square for good
            this.square.piece = null;
        }
        this.pos.x = square.pos.x + ((square.width - this.width) / 2);
        this.pos.y = square.pos.y + (((square.height - this.height) / 2) + this.offsetY);
        this.pos.z = square.row + 2;
        this.square = square;
        this.square.piece = this;
        me.game.world.sort(true);
    },

    setPieceState: function (state) {
        var prevState = this.state;
        this.state = state;
        switch (this.state) {
            case game.PieceState.IDLE:
                // if the pieces was held and is now idle
                if (prevState == game.PieceState.HELD) {
                    // place it on the nearest space
                    var closestSquare = this.board.getClosestSquare(
                        this.pos.x - ((this.square.width - this.width) / 2),
                        this.pos.y - (((this.square.height - this.height) / 2) + this.offsetY));

                    if (closestSquare.isOccupied ()) {
                        // go back to the last square this piece was on
                        this.moveToSquare(this.square);
                    } else {
                        this.moveToSquare(closestSquare);
                    }
                }
                break;

            case game.PieceState.HELD:
                // piece has been picked up
                this.pos.z = 50;
                me.game.world.sort(true);
                break;

            default:
                break;
        }
    },

    isHeld: function () {
        return this.state == game.PieceState.HELD;
    },

    initEvents: function () {
        this._super(me.DraggableEntity, "initEvents");

        // remove the old pointerdown and pointerup events
        this.removePointerEvent("pointerdown", this);
        this.removePointerEvent("pointerup", this);

        // define the new events that return false (don't fall through)
        this.mouseDown = function (e) {
            this.translatePointerEvent(e, me.event.DRAGSTART);
            return false;
        };
        this.mouseUp = function (e) {
            this.translatePointerEvent(e, me.event.DRAGEND);
            return false;
        };

        // add the new pointerdown and pointerup events
        this.onPointerEvent("pointerdown", this, this.mouseDown.bind(this));
        this.onPointerEvent("pointerup", this, this.mouseUp.bind(this));
    },

    dragStart: function (e) {
        this._super(me.DraggableEntity, "dragStart", [e]);
        this.setPieceState(game.PieceState.HELD);
    },

    dragEnd: function (e) {
        this._super(me.DraggableEntity, "dragEnd", [e]);
        this.setPieceState(game.PieceState.IDLE);
    }
});
