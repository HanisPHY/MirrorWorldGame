import * as PIXI from "pixi.js";

class CharacterSprite extends PIXI.Sprite {
    vx: number = 0;
    vy: number = 0;
}

export function handleKeyDown(e: KeyboardEvent, character: CharacterSprite) {
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

export function handleKeyUp(e: KeyboardEvent, character: CharacterSprite) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        character.vx = 0;
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        character.vy = 0;
    }
}

export function isColliding(rect1: CharacterSprite | PIXI.Graphics, rect2: CharacterSprite | PIXI.Graphics): boolean {
    const r1 = rect1.getBounds();
    const r2 = rect2.getBounds();
    return !(r1.x + r1.width < r2.x ||
             r1.x > r2.x + r2.width ||
             r1.y + r1.height < r2.y ||
             r1.y > r2.y + r2.height);
}

export function resetCharacter(character: CharacterSprite) {
    character.x = 50;
    character.y = character.height > 100 ? 500 : 200;  // Adjust based on level
}