// level3.js

let level3Ticker;
let magicCollected = false;
let notAllowedAreas = []; // To store areas that are not allowed for both characters

function setupLevel3(texture) {
    app.stage.removeChildren();
    magicCollected = false;
    notAllowedAreas = []; // Clear not allowed areas

    const character = new PIXI.Sprite(texture);
    character.x = 50;
    character.y = 200;
    character.width = 50;
    character.height = 50;
    character.vx = 0;
    character.vy = 0;
    character.anchor.set(0.5);
    app.stage.addChild(character);

    const reflectiveCharacter = new PIXI.Sprite(texture);
    reflectiveCharacter.scale.y = -1;
    reflectiveCharacter.width = 50;
    reflectiveCharacter.height = 50;
    reflectiveCharacter.alpha = 0.5;
    reflectiveCharacter.anchor.set(0.5);
    reflectiveCharacter.x = character.x;
    reflectiveCharacter.y = 600 - character.y;
    app.stage.addChild(reflectiveCharacter);

    // Create the mirror line in the middle
    const mirrorLine = new PIXI.Graphics();
    mirrorLine.lineStyle(2, 0xffffff, 1);
    mirrorLine.moveTo(0, 300);
    mirrorLine.lineTo(800, 300);
    app.stage.addChild(mirrorLine);

    // Create obstacles based on drawing
    const obstacles = [
        createObstacle(100, 200, 50, 50),
        createObstacle(200, 400, 50, 50),
        createObstacle(400, 250, 50, 50)
    ];
    obstacles.forEach(obstacle => app.stage.addChild(obstacle));

    // Create magic
    const magic = new PIXI.Graphics();
    magic.beginFill(0xffd700);
    magic.drawCircle(300, 150, 15);
    magic.endFill();
    app.stage.addChild(magic);

    // Create walls
    const walls = [
        createWall(350, 100, 20, 200),
        createWall(200, 550, 200, 20), // Added another wall
        createWall(580, 160, 100, 20)
    ];
    walls.forEach(wall => {
        app.stage.addChild(wall);
        notAllowedAreas.push(wall.getBounds()); // Add wall area to not allowed areas
    });

    // Create two goals
    const goalCharacter = createGoal(700, 100);
    const goalReflective = createGoal(700, 500);
    app.stage.addChild(goalCharacter);
    app.stage.addChild(goalReflective);

    const xLabel = new PIXI.Text("X: 0", { fill: 0xffffff });
    const yLabel = new PIXI.Text("Y: 0", { fill: 0xffffff });
    xLabel.x = 10;
    xLabel.y = 10;
    yLabel.x = 10;
    yLabel.y = 30;
    app.stage.addChild(xLabel);
    app.stage.addChild(yLabel);

    // Keyboard interaction
    window.addEventListener("keydown", (e) => handleKeyDown(e, character));
    window.addEventListener("keyup", (e) => handleKeyUp(e, character));

    // Game loop
    level3Ticker = () => gameLoopLevel3(character, reflectiveCharacter, obstacles, magic, walls, goalCharacter, goalReflective, xLabel, yLabel);
    app.ticker.add(level3Ticker);
}

function gameLoopLevel3(character, reflectiveCharacter, obstacles, magic, walls, goalCharacter, goalReflective, xLabel, yLabel) {
    // Determine next position for the character
    let nextCharacterX = character.x + character.vx;
    let nextCharacterY = character.y + character.vy;
    let nextReflectiveX = reflectiveCharacter.x + character.vx;
    let nextReflectiveY = reflectiveCharacter.y - character.vy;

    // Handle magic collection
    if (isColliding(character, magic)) {
        magicCollected = true;
        magic.visible = false;
    }

    // Check if the next position is allowed for character
    if (isPositionAllowed(nextCharacterX, nextCharacterY, character.width, character.height)) {
        character.x = nextCharacterX;
        character.y = nextCharacterY;
    } else {
        character.vx = 0;
        character.vy = 0;
    }

    // Reflective character logic
    if (magicCollected) {
        // Independent movement after collecting magic
        if (isPositionAllowed(nextReflectiveX, nextReflectiveY, reflectiveCharacter.width, reflectiveCharacter.height)) {
            reflectiveCharacter.x = nextReflectiveX;
            reflectiveCharacter.y = nextReflectiveY;
        }
    } else {
        // Symmetric movement before collecting magic
        reflectiveCharacter.x = character.x;
        reflectiveCharacter.y = 600 - character.y;
    }

    // Keep character within bounds (top half of the area)
    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height / 2 - character.height, character.y));

    // Keep reflective character within bounds (bottom half of the area)
    reflectiveCharacter.x = Math.max(0, Math.min(app.view.width - reflectiveCharacter.width, reflectiveCharacter.x));
    reflectiveCharacter.y = Math.max(300, Math.min(app.view.height - reflectiveCharacter.height, reflectiveCharacter.y));

    // Update coordinate labels
    xLabel.text = `X: ${Math.round(character.x)}`;
    yLabel.text = `Y: ${Math.round(character.y)}`;

    // Collision detection with obstacles - reset both characters if either hits an obstacle
    for (const obstacle of obstacles) {
        if (isColliding(character, obstacle) || isColliding(reflectiveCharacter, obstacle)) {
            resetLevel3();
            return;
        }
    }

    // Check if both characters reached their goals simultaneously
    if (isColliding(character, goalCharacter) && isColliding(reflectiveCharacter, goalReflective)) {
        app.ticker.remove(level3Ticker);
        alert("Level Completed!");
    }
}

function isPositionAllowed(nextX, nextY, width, height) {
    const nextBounds = { x: nextX, y: nextY, width: width, height: height };
    for (const area of notAllowedAreas) {
        if (!(nextBounds.x + nextBounds.width < area.x ||
              nextBounds.x > area.x + area.width ||
              nextBounds.y + nextBounds.height < area.y ||
              nextBounds.y > area.y + area.height)) {
            return false; // Position collides with a wall or not allowed area
        }
    }
    return true;
}

function resetLevel3() {
    app.ticker.remove(level3Ticker);
    setupLevel3(PIXI.Assets.get('https://i.imgur.com/IaUrttj.png'));
}

function createObstacle(x, y, width, height) {
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0x0000ff);
    obstacle.drawRect(x, y, width, height);
    obstacle.endFill();
    return obstacle;
}

function createWall(x, y, width, height) {
    const wall = new PIXI.Graphics();
    wall.beginFill(0x000000);
    wall.drawRect(x, y, width, height);
    wall.endFill();
    return wall;
}

function createGoal(x, y) {
    const goal = new PIXI.Graphics();
    goal.beginFill(0x00ff00);
    goal.drawRect(x, y, 50, 50);
    goal.endFill();
    return goal;
}