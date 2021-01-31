// PIXI.js aliases
let Application = PIXI.Application,
	Container = PIXI.Container,
	Sprite = PIXI.Sprite;


const app = new Application({
	width: 800,
	height: 600,
	resolution: window.devicePixelRatio,
	autoDensity: true
});

const tileSize = 16;

let map = {
	width: 4,
	height: 4,
	tiles: [ 0,0,0,0,
			 0,0,0,0,
			 0,0,0,0,
			 0,0,0,0]
}


document.body.appendChild(app.view);



// load PIXI assets
let loader = PIXI.Loader.shared;  // (for PIXI v5+)
loader.add("tileset", "nature-platformer-tileset-16x16.png")
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
		tileTextures[i] = new PIXI.Texture(
			loader.resources.tileset.texture,
			new PIXI.Rectangle(x * tileSize, y * tileSize, tileSize, tileSize));
	}

	const img = new Sprite(tileTextures[55]);

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

	app.stage.addChild(background);
}