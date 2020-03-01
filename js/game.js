/* Game namespace */
var game = {
  // Run on page load.
  "onload": function() {
    // Initialize the video.
    if (!me.video.init(640, 480, {
        wrapper: "screen",
        scale: "auto"
      })) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // Add "#debug" to the URL to enable the debug Panel.
    if (me.utils.getUriFragment().debug === true) {
      me.device.onReady(function() {
        me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
      });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set and load all resources.
    // (this will also automatically switch to the loading screen)
    me.loader.preload(game.resources, this.loaded.bind(this));
  },

  // Run on game resources loaded.
  "loaded": function() {

    // Add entities to the entity pool.
    me.pool.register("board", game.Board);

    // Create the play screen.
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};
