var arch, state;

//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

//Create a Pixi Application
let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: 1
  }
);
document.getElementById('Canvas').appendChild(app.view);




PIXI.loader
    // .add('Arch', 'arch.js')
    .load(setup());

// function loadProgressHandler() {
  // console.log("loading: " + resource.url);
  // console.log("progress: " + loader.progress + "%");
// }

// let message = new Text("Hello Pixi!");
// app.stage.addChild(message);
// message.position.set(54, 96);
// let style = new TextStyle({
//   fontFamily: "Arial",
//   fontSize: 36,
//   fill: "white",
//   stroke: '#ff3300',
//   strokeThickness: 4,
//   dropShadow: true,
//   dropShadowColor: "#000000",
//   dropShadowBlur: 4,
//   dropShadowAngle: Math.PI / 6,
//   dropShadowDistance: 6,
// });
// message.text = "Text changed!";

function setup() {
  console.log("All files loaded");

  app.renderer.backgroundColor = 0x000000;
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
  app.renderer.autoResize = true;
  app.renderer.resize(window.innerWidth, window.innerHeight);
  arch = new Arch(PIXI, 50);

  //set the state
  state = ledDraw;

  //Start the game loop by adding the `gameLoop` function to
  //Pixi's `ticker` and providing it with a `delta` argument.
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  //Update the current game state:
  state(delta);
}

function ledDraw(delta){

}



//keyboard controller
function keyboard(keyCode)
{
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.release = undefined;

    //downhandler
    key.downHandler = function(event)
    {
        if (event.keyCode === key.code)
        {
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //uphandler
    key.upHandler = function(event)
    {
        if (event.keyCode === key.code)
        {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    // event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
}
