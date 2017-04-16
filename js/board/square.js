game.Square = me.Entity.extend({

    init : function(x, y, width, height, color) {
        // position, width, height
        this._super(me.Entity, "init", [x, y, {
            width : width,
            height : height
        }]);
        this.color = color;
    },

    draw : function(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    },

    update : function() {
        return false;
    }
});
