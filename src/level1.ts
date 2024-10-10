
import { Application, Sprite, Graphics, Texture } from 'pixi.js';
import { handleKeyDown, handleKeyUp, isColliding, resetCharacter } from './utils';
import { setupLevel2 } from './level2';
import * as PIXI from 'pixi.js';

let level1Ticker: () => void;

class CharacterSprite extends PIXI.Sprite {
    vx: number = 0;
    vy: number = 0;
  }

export function setupLevel1(texture: Texture, app: Application) {
    app.stage.removeChildren();

    const character = new CharacterSprite(texture);
    character.x = 50;
    character.y = 500;
    character.width = 50;
    character.height = 50;
    character.vx = 0;
    character.vy = 0;
    app.stage.addChild(character);
    console.log('Added character to stage');

    const obstacle = new Graphics();
    obstacle.rect(300, 400, 100, 30);
    obstacle.fill(0xff0000);
    app.stage.addChild(obstacle);

    const goal = new Graphics();
    goal.rect(700, 100, 50, 50);
    goal.fill(0x00ff00);
    app.stage.addChild(goal);

    window.addEventListener("keydown", (e) => handleKeyDown(e, character));
    window.addEventListener("keyup", (e) => handleKeyUp(e, character));

    level1Ticker = () => gameLoopLevel1(character, obstacle, goal, texture, app);
    app.ticker.add(level1Ticker);
}

function gameLoopLevel1(character: CharacterSprite, obstacle: Graphics, goal: Graphics, texture: Texture, app: Application) {
    character.x += character.vx;
    character.y += character.vy;

    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height - character.height, character.y));

    if (isColliding(character, obstacle)) {
        resetCharacter(character);
    }

    if (isColliding(character, goal)) {
        app.ticker.remove(level1Ticker);
        setupLevel2(texture, app);
    }
}