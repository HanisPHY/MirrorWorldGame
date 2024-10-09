// main.js

const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

let currentLevel = 1;

// Load the character texture and start the setup process
async function setup() {
    const texture = await PIXI.Assets.load('https://i.imgur.com/IaUrttj.png');
    setupLevel1(texture);
}

setup();
