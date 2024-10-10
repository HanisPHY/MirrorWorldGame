import { Application } from 'pixi.js';
import { setupLevel1 } from './level1';
import * as PIXI from 'pixi.js';

(async () =>
{
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
    });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    function setup() {
        PIXI.Assets.load('https://i.imgur.com/IaUrttj.png')
            .then((texture) => {
                setupLevel1(texture, app);
            })
            .catch((error) => {
                console.error('Error loading texture:', error);
            });
    }
    
    setup();
})();