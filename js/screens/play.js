game.PlayScreen = me.ScreenObject.extend({
    /**
     * action to perform on state change
     */
    onResetEvent : function () {
        // Add a background color.
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), -1);

        // Create the board.
        me.game.world.addChild(me.pool.pull("board"), 0);

        // Bind input.
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");
    },

    /**
     * action to perform when leaving this screen (state change)
     */
    onDestroyEvent : function () {
        // Unbind input.
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.D);
    }
});
