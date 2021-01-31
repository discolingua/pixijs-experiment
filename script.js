const app = new PIXI.Application({
	width: 800,
	height: 600,
	resolution: window.devicePixelRatio,
	autoDensity: true
});

document.body.appendChild(app.view);

// const tileSize = 16;



// load PIXI assets
let loader = PIXI.Loader.shared;  // (for PIXI v5+)
loader.add("tileset", "nature-platformer-tileset-16x16.png")
	  .on('error', handleLoadError)
  	  .load(handleLoadComplete);


function handleLoadError() {
	console.log("asset load error");
}

function handleLoadComplete() {
	const img = new PIXI.Sprite(loader.resources.tileset.texture);
	app.stage.addChild(img);
}

