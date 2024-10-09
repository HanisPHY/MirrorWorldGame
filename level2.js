// level2.js

function setupLevel2(texture) {
    app.stage.removeChildren();
    console.log("level 2")

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

    // Create the mirror line in the middle
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

    console.log("Finished setting up level 2");

    // Game loop
    level2Ticker = () => gameLoopLevel2(character, reflectiveCharacter, obstacle, goal);
    app.ticker.add(level2Ticker);
}

function gameLoopLevel2(character, reflectiveCharacter, obstacle, goal) {
    // Update character position
    character.x += character.vx;
    character.y += character.vy;

    // Keep character within top half of the area
    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height / 2 - character.height, character.y));

    // Update reflective character position symmetrically in the bottom half
    reflectiveCharacter.x = character.x;
    reflectiveCharacter.y = 600 - character.y;

    // Collision detection with the obstacle
    if (isColliding(character, obstacle) || isColliding(reflectiveCharacter, obstacle)) {
        resetCharacter(character);
    }

    // Check if the character reached the goal
    if (isColliding(character, goal)) {
        console.log("Finish level 2");
        alert("Level Completed! Moving to the next level.");
        app.ticker.remove(level2Ticker);
    }
}
