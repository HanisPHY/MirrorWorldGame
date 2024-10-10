
import { Application, Sprite, Graphics, Texture } from 'pixi.js';
import { handleKeyDown, handleKeyUp, isColliding, resetCharacter } from './utils';
import { setupLevel3 } from './level3';
import * as PIXI from 'pixi.js';

class CharacterSprite extends PIXI.Sprite {
    vx: number = 0;
    vy: number = 0;
}

let level2Ticker: () => void;

function setupLevel2(texture: Texture, app: Application) {
    app.stage.removeChildren();

    const character = new CharacterSprite(texture);
    character.x = 50;
    character.y = 200;
    character.width = 50;
    character.height = 50;
    character.vx = 0;
    character.vy = 0;
    character.anchor.set(0.5);
    app.stage.addChild(character);

    const reflectiveCharacter = new CharacterSprite(texture);
    reflectiveCharacter.scale.y = -1;
    reflectiveCharacter.width = 50;
    reflectiveCharacter.height = 50;
    reflectiveCharacter.alpha = 0.5;
    reflectiveCharacter.anchor.set(0.5);
    app.stage.addChild(reflectiveCharacter);

    const mirrorLine = new Graphics();
    // mirrorLine.setStrokeStyle({
    //     width: 2,           // Line thickness
    //     color: 0xffffff,    // Line color in hex
    //     alpha: 1,           // Line opacity
    // });
    // mirrorLine.moveTo(0, 300);
    // mirrorLine.lineTo(800, 300);
    mirrorLine.moveTo(0, 300);
    mirrorLine.lineTo(800, 300);
    mirrorLine.stroke({ color: 0xffffff, width: 2 });
    app.stage.addChild(mirrorLine);

    const obstacle = new Graphics();
    obstacle.rect(300, 300, 100, 30);
    obstacle.fill(0xff0000);
    app.stage.addChild(obstacle);

    const goal = new Graphics();
    goal.rect(700, 100, 50, 50);
    goal.fill(0x00ff00);
    app.stage.addChild(goal);

    window.addEventListener("keydown", (e) => handleKeyDown(e, character));
    window.addEventListener("keyup", (e) => handleKeyUp(e, character));

    level2Ticker = () => gameLoopLevel2(character, reflectiveCharacter, obstacle, goal, texture, app);
    app.ticker.add(level2Ticker);
}

function gameLoopLevel2(character: CharacterSprite, reflectiveCharacter: CharacterSprite, obstacle: Graphics, goal: Graphics, texture: Texture, app: Application) {
    character.x += character.vx;
    character.y += character.vy;

    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height / 2 - character.height, character.y));

    reflectiveCharacter.x = character.x;
    reflectiveCharacter.y = 600 - character.y;

    if (isColliding(character, obstacle) || isColliding(reflectiveCharacter, obstacle)) {
        resetCharacter(character);
    }

    if (isColliding(character, goal)) {
        app.ticker.remove(level2Ticker);
        setupLevel3(texture, app);
    }
}

export { setupLevel2 };