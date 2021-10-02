import * as me from 'melonjs/dist/melonjs.module.js';
import 'index.css';

import PlayScreen from 'js/screens/play.js';
import Board from 'js/board.js';

import DataManifest from 'manifest.js';

me.device.onReady(function () {

    // initialize the display canvas once the device/browser is ready
    if (!me.video.init(1218, 562, { parent: "screen", scale: "auto" })) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    me.loader.crossOrigin = "anonymous";

    // set and load all resources.
    me.loader.preload(DataManifest, function () {
        // // set the user defined game stages
        // me.state.set(me.state.MENU, new TitleScreen());
        // me.state.set(me.state.PLAY, new PlayScreen());

        // // add our player entity in the entity pool
        // me.pool.register("mainPlayer", PlayerEntity);

        // // Start the game.
        // me.state.change(me.state.PLAY);

        // Add entities to the entity pool.
        me.pool.register("board", Board);

        // Create the play screen.
        me.state.set(me.state.PLAY, new PlayScreen());

        // Start the game.
        me.state.change(me.state.PLAY);
    });
});
