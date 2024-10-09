// Import the required PixiJS library
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// Load the character texture and create the character sprite
async function setup() {
    const texture = await PIXI.Assets.load('https://i.imgur.com/IaUrttj.png');
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
    app.ticker.add(() => gameLoop(character, obstacle, goal));
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

function gameLoop(character, obstacle, goal) {
    // Update character position
    character.x += character.vx;
    character.y += character.vy;

    // Collision detection with the obstacle
    if (isColliding(character, obstacle)) {
        resetCharacter(character);
    }

    // Check if the character reached the goal
    if (isColliding(character, goal)) {
        alert("Level Completed! Moving to the next level.");
        resetCharacter(character);
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
    character.x = 50;
    character.y = 500;
}

// Start the game setup
setup();