game.PlayScreen = me.ScreenObject.extend({
    /**
     * action to perform on state change
     */
    onResetEvent : function () {
        // Add a background color.
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);

        // Add the player.
        me.game.world.addChild(me.pool.pull("player"));

        // An an enemy.
        me.game.world.addChild(me.pool.pull("enemy", 50, 50), 2);
    },

    /**
     * action to perform when leaving this screen (state change)
     */
    onDestroyEvent : function () {
    }
});
