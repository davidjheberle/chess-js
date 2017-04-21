var row;
var column;

game.Square = me.Entity.extend({
    init : function (x, y, width, height, color, row, column) {
        // position, width, height
        this._super(me.Entity, "init", [x, y, {
            width : width,
            height : height
        }]);
        this.color = color;
        this.row = row;
        this.column = column;
    },

    draw : function (renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    },

    update : function () {
        return false;
    }
});
