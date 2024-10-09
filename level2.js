// level2.js

let level2Ticker;

function setupLevel2(texture) {
    app.stage.removeChildren();

    const character = new PIXI.Sprite(texture);
    character.x = 50;
    character.y = 200;
    character.width = 50;
    character.height = 50;
    character.vx = 0;
    character.vy = 0;
    character.anchor.set(0.5);
    app.stage.addChild(character);

    // Create reflective character
    const reflectiveCharacter = new PIXI.Sprite(texture);
    reflectiveCharacter.scale.y = -1;
    reflectiveCharacter.width = 50;
    reflectiveCharacter.height = 50;
    reflectiveCharacter.alpha = 0.5;
    reflectiveCharacter.anchor.set(0.5);
    app.stage.addChild(reflectiveCharacter);

    // Create the mirror line
    const mirrorLine = new PIXI.Graphics();
    mirrorLine.lineStyle(2, 0xffffff, 1);
    mirrorLine.moveTo(0, 300);
    mirrorLine.lineTo(800, 300);
    app.stage.addChild(mirrorLine);

    // Create an obstacle
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0xff0000);
    obstacle.drawRect(300, 300, 100, 30);
    obstacle.endFill();
    app.stage.addChild(obstacle);

    // Create the final destination
    const goal = new PIXI.Graphics();
    goal.beginFill(0x00ff00);
    goal.drawRect(700, 100, 50, 50);
    goal.endFill();
    app.stage.addChild(goal);

    // Keyboard interaction
    window.addEventListener("keydown", (e) => handleKeyDown(e, character));
    window.addEventListener("keyup", (e) => handleKeyUp(e, character));

    // Game loop
    level2Ticker = () => gameLoopLevel2(character, reflectiveCharacter, obstacle, goal, texture);
    app.ticker.add(level2Ticker);
}

function gameLoopLevel2(character, reflectiveCharacter, obstacle, goal, texture) {
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
        setupLevel3(texture);
    }
}
