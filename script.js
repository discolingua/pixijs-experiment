// PIXI.js aliases
let Application = PIXI.Application,
	Container = PIXI.Container,
	Rectangle = PIXI.Rectangle,
	Texture = PIXI.Texture,
	Sprite = PIXI.Sprite;

const app = new Application({
	width: 768,
	height: 600,
	resolution: window.devicePixelRatio,
	autoDensity: true
});

const GRAVITY = 0.5;
const SCALE = 4;
const tileSize = 16;

let map = {
	width: 12,
	height: 8,
	tiles: [ 
			12,12,12,12,12,12,12,12,12,12,12,12,
			12,12,12,12,12,12,12,12,12,12,12,12,
			12,12,12,12,12,12,12,12,12,12,12,12,
			3,4,4,5,12,12,12,12,3,4,4,5,
			12,12,12,12,12,12,12,12,12,12,12,12,
			12,12,45,12,12,12,12,12,12,48,12,12,
			0,1,1,1,1,1,1,1,1,1,1,2,
			14,15,15,15,15,15,15,15,15,15,15,16
			],
	collision: [
			0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,
			1,1,1,1,0,0,0,0,1,1,1,1,
			0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,0,0,0,0,
			1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1															
	]
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

function testCollision(worldX, worldY) {
	let mapX = Math.floor(worldX / tileSize / SCALE);
	let mapY = Math.floor(worldY / tileSize / SCALE);
	return map.collision[mapY * map.width + mapX];
}

document.body.appendChild(app.view);


// load PIXI assets
let loader = PIXI.Loader.shared;  // (for PIXI v5+)
loader.add("tileset", "nature-platformer-tileset-16x16.png")
	  .add("playertiles", "characters.png")
	  .on('error', handleLoadError)
  	  .load(handleLoadComplete);


function handleLoadError() {
	console.log("asset load error");
}

function handleLoadComplete() {

	// slice up tile textures from sprite sheet
	let tileTextures = [];
	for (let i = 0; i < 77; i++) {
		let x = i % 7;
		let y = Math.floor(i / 7);
		tileTextures[i] = new Texture(
			loader.resources.tileset.texture,
			new Rectangle(x * tileSize, y * tileSize, tileSize, tileSize));
	}

	let playerFrames = [];
	for (let i = 0; i < 8; i++) {
		playerFrames[i] = new Texture(
			loader.resources.playertiles.texture,
			new Rectangle(i * tileSize, 32, tileSize, 32));
	}

	const player = new Sprite(playerFrames[0]);
	player.scale.x = SCALE;
	player.scale.y = SCALE;

	let sky = new PIXI.TilingSprite(tileTextures[74], map.width * tileSize, map.height * tileSize)

	// build background map from map object
	let background = new Container();
	for (let y = 0; y < map.height; y++) {
		for (let x = 0; x < map.width; x++) {
			let tile = map.tiles[y * map.width + x];
			let sprite = new Sprite(tileTextures[tile]);
			sprite.x = x * tileSize;
			sprite.y = y * tileSize;
			background.addChild(sprite);
		}
	}
	sky.scale.x = SCALE;
	sky.scale.y = SCALE;
	background.scale.x = SCALE;
	background.scale.y = SCALE;
	app.stage.addChild(sky);
	app.stage.addChild(background);
	app.stage.addChild(player);

	let character = {
		x: 0, y: 0,
		vx: 0, vy: 0
	};

	// List for frame updates
	app.ticker.add(() => {
		player.x = character.x;
		player.y = character.y;

		character.vy += .1; // gravity
		character.x += character.vx;
		// character.y += character.vy;
		if (character.vy > 0) {
			for (let i = 0; i < character.vy; i++) {
		 		let testX1 = character.x;
				let testX2 = character.x + tileSize * SCALE - 1;
		 		let testY = character.y + tileSize * SCALE * 2;
		 		if (testCollision(testX1, testY)) {
		 			character.vy = 0;
		 			break;
		 		}
		 		character.y += GRAVITY;
		 	}
		 }
	});
}