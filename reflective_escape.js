// Import the required PixiJS library
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

let currentLevel = 1;
let level1Ticker;
let level2Ticker;

// Load the character texture and create the character sprite
async function setup() {
    const texture = await PIXI.Assets.load('https://i.imgur.com/IaUrttj.png');
    setupLevel1(texture);
}

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
    // Update character position
    character.x += character.vx;
    character.y += character.vy;

    // Keep character within bounds
    character.x = Math.max(0, Math.min(app.view.width - character.width, character.x));
    character.y = Math.max(0, Math.min(app.view.height - character.height, character.y));

    // Collision detection with the obstacle
    if (isColliding(character, obstacle)) {
        resetCharacter(character);
    }

    // Check if the character reached the goal
    if (isColliding(character, goal)) {
        // alert("Level Completed! Moving to the next level.");
        console.log("Finish level 1");
        currentLevel = 2;
        app.ticker.remove(level1Ticker);
        setupLevel2(texture);
    }
}

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
        // Logic for moving to the next level can be added here
    }
}

function handleKeyDown(e, character) {
    if (e.key === "ArrowRight") {
        character.vx = 3;
    } else if (e.key === "ArrowLeft") {
        character.vx = -3;
    } else if (e.key === "ArrowUp") {
        character.vy = -3;
    } else if (e.key === "ArrowDown") {
        character.vy = 3;
    }
}

function handleKeyUp(e, character) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        character.vx = 0;
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        character.vy = 0;
    }
}

function isColliding(rect1, rect2) {
    const r1 = rect1.getBounds();
    const r2 = rect2.getBounds();
    return !(r1.x + r1.width < r2.x ||
             r1.x > r2.x + r2.width ||
             r1.y + r1.height < r2.y ||
             r1.y > r2.y + r2.height);
}

function resetCharacter(character) {
    if (currentLevel === 1) {
        character.x = 50;
        character.y = 500;
    } else if (currentLevel === 2) {
        character.x = 50;
        character.y = 200;
    }
}

// Start the game setup
setup();