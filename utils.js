// utils.js or shared in each level file

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
