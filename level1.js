// level1.js

let level1Ticker;

function setupLevel1(texture) {
    app.stage.removeChildren();

    const character = new PIXI.Sprite(texture);
    character.x = 50;
    character.y = 500;
    character.width = 50;
    character.height = 50;
    character.vx = 0;
    character.vy = 0;
    app.stage.addChild(character);

    // Create an obstacle
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0xff0000);
    obstacle.drawRect(300, 400, 100, 30);
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
    level1Ticker = () => gameLoopLevel1(character, obstacle, goal, texture);
    app.ticker.add(level1Ticker);
}

function gameLoopLevel1(character, obstacle, goal, texture) {
    character.x += character.vx;
    character.y += character.vy;

    // Keep character within bounds
    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height - character.height, character.y));

    // Collision detection
    if (isColliding(character, obstacle)) {
        resetCharacter(character);
    }

    if (isColliding(character, goal)) {
        app.ticker.remove(level1Ticker);
        setupLevel2(texture);
    }
}
