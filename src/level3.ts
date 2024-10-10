
import { Application, Sprite, Graphics, Texture, Text } from 'pixi.js';
import { handleKeyDown, handleKeyUp, isColliding } from './utils';
import { resetCharacter } from './utils';
import * as PIXI from 'pixi.js';

declare const app: Application;

class CharacterSprite extends PIXI.Sprite {
    vx: number = 0;
    vy: number = 0;
}

let level3Ticker: () => void;
let magicCollected = false;
let notAllowedAreas: PIXI.Rectangle[] = [];

function setupLevel3(texture: Texture, app: Application) {
    app.stage.removeChildren();
    magicCollected = false;
    notAllowedAreas = [];

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
    reflectiveCharacter.x = character.x;
    reflectiveCharacter.y = 600 - character.y;
    app.stage.addChild(reflectiveCharacter);

    const mirrorLine = new Graphics();
    // mirrorLine.lineStyle(2, 0xffffff, 1);
    mirrorLine.moveTo(0, 300);
    mirrorLine.lineTo(800, 300);
    mirrorLine.stroke({ color: 0xffffff, width: 2 });
    app.stage.addChild(mirrorLine);

    const obstacles = [
        createObstacle(100, 200, 50, 50),
        createObstacle(200, 400, 50, 50),
        createObstacle(400, 250, 50, 50)
    ];
    obstacles.forEach(obstacle => app.stage.addChild(obstacle));

    const magic = new Graphics();
    magic.circle(300, 150, 15);
    magic.fill(0xffd700);
    app.stage.addChild(magic);

    const walls = [
        createWall(350, 100, 20, 200),
        createWall(580, 160, 100, 20)
    ];
    walls.forEach(wall => {
        app.stage.addChild(wall);
        const bounds = wall.getBounds();  // This returns PIXI.Bounds
        // Convert bounds to PIXI.Rectangle
        const rectangle = new PIXI.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
        notAllowedAreas.push(rectangle);
    });

    const goalCharacter = createGoal(700, 100);
    const goalReflective = createGoal(700, 400);
    app.stage.addChild(goalCharacter);
    app.stage.addChild(goalReflective);

    const xLabel = new Text("X: 0", { fill: 0xffffff });
    const yLabel = new Text("Y: 0", { fill: 0xffffff });
    xLabel.x = 10;
    xLabel.y = 10;
    yLabel.x = 10;
    yLabel.y = 30;
    app.stage.addChild(xLabel);
    app.stage.addChild(yLabel);

    window.addEventListener("keydown", (e) => handleKeyDown(e, character));
    window.addEventListener("keyup", (e) => handleKeyUp(e, character));

    level3Ticker = () => gameLoopLevel3(character, reflectiveCharacter, obstacles, magic, walls, goalCharacter, goalReflective, xLabel, yLabel, app);
    app.ticker.add(level3Ticker);
}

function gameLoopLevel3(character: CharacterSprite, reflectiveCharacter: CharacterSprite, obstacles: Graphics[], magic: Graphics, walls: Graphics[], goalCharacter: Graphics, goalReflective: Graphics, xLabel: Text, yLabel: Text, app: Application) {
    let nextCharacterX = character.x + character.vx;
    let nextCharacterY = character.y + character.vy;
    let nextReflectiveX = reflectiveCharacter.x + character.vx;
    let nextReflectiveY = reflectiveCharacter.y - character.vy;

    if (isColliding(character, magic)) {
        magicCollected = true;
        magic.visible = false;
    }

    if (isPositionAllowed(nextCharacterX, nextCharacterY, character.width, character.height)) {
        character.x = nextCharacterX;
        character.y = nextCharacterY;
    } else {
        character.vx = 0;
        character.vy = 0;
    }

    if (magicCollected) {
        if (isPositionAllowed(nextReflectiveX, nextReflectiveY, reflectiveCharacter.width, reflectiveCharacter.height)) {
            reflectiveCharacter.x = nextReflectiveX;
            reflectiveCharacter.y = nextReflectiveY;
        }
    } else {
        reflectiveCharacter.x = character.x;
        reflectiveCharacter.y = 600 - character.y;
    }

    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height / 2 - character.height, character.y));

    reflectiveCharacter.x = Math.max(0, Math.min(app.view.width - reflectiveCharacter.width, reflectiveCharacter.x));
    reflectiveCharacter.y = Math.max(300, Math.min(app.view.height - reflectiveCharacter.height, reflectiveCharacter.y));

    xLabel.text = `X: ${Math.round(character.x)}`;
    yLabel.text = `Y: ${Math.round(character.y)}`;

    for (const obstacle of obstacles) {
        if (isColliding(character, obstacle) || isColliding(reflectiveCharacter, obstacle)) {
            resetCharacter(character);
            return;
        }
    }

    if (isColliding(character, goalCharacter) && isColliding(reflectiveCharacter, goalReflective)) {
        app.ticker.remove(level3Ticker);
        alert("Level Completed!");
    }
}

function isPositionAllowed(nextX: number, nextY: number, width: number, height: number): boolean {
    const nextBounds = { x: nextX, y: nextY, width: width, height: height };
    for (const area of notAllowedAreas) {
        if (!(nextBounds.x + nextBounds.width < area.x ||
              nextBounds.x > area.x + area.width ||
              nextBounds.y + nextBounds.height < area.y ||
              nextBounds.y > area.y + area.height)) {
            return false;
        }
    }
    return true;
}

 function resetLevel3() {
    app.ticker.remove(level3Ticker);
    // setupLevel3(PIXI.Assets.get('https://i.imgur.com/IaUrttj.png') as Texture);
}

 function createObstacle(x: number, y: number, width: number, height: number): Graphics {
    const obstacle = new Graphics();
    obstacle.rect(x, y, width, height);
    obstacle.fill(0xff0000);
    // obstacle.beginFill(0x0000ff);
    // obstacle.drawRect(x, y, width, height);
    // obstacle.endFill();
    return obstacle;
}

 function createWall(x: number, y: number, width: number, height: number): Graphics {
    const wall = new Graphics();
    wall.rect(x, y, width, height);
    wall.fill(0x000000);
    // wall.beginFill(0x000000);
    // wall.drawRect(x, y, width, height);
    // wall.endFill();
    return wall;
}

 function createGoal(x: number, y: number): Graphics {
    const goal = new Graphics();
    goal.rect(x, y, 20, 20);
    goal.fill(0x00ff00);
    // goal.beginFill(0x00ff00);
    // goal.drawRect(x, y, 20, 20);
    // goal.endFill();
    return goal;
}

export { setupLevel3 };