var http = require('http');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const gameloop = require('node-gameloop');

var NUM_LEDS = 217;
var STRIP = require("./Strip.js");
const isPi = require('detect-rpi');
var strip = new STRIP(isPi(), NUM_LEDS);

// trap the SIGINT and reset before exit
process.on('SIGINT', function ()
{
  strip.reset();
  process.nextTick(function () { process.exit(0); });
});

app.use(express.static('client'));

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");

io.on('connect', function(client){
    console.log("Connection ", client.id);

    client.on('event', function(data){
      // console.log("Event: ", data);
      strip.changeState(data.state);
    });

    client.on('disconnect', function(){
      console.log("Disconect: ", client.id);
    });
});


// start the loop at 30 fps (1000/30ms per frame) and grab its id
let frameCount = 0;
let frameRate = 30;
const id = gameloop.setGameLoop(function(delta) {
    // `delta` is the delta time from the last frame
    // console.log('Frame=%s, Delta=%s', frameCount++, delta);

    strip.update(delta);



}, 1000 / frameRate);

// stop the loop 2 seconds later
// setTimeout(function() {
//     console.log('2000ms passed, stopping the game loop');
//     gameloop.clearGameLoop(id);
// }, 2000);


// beforeRender: emitted just before the data is prepared and sent to the LED-driver.
// The handler will receive the pixel-data array (an Uint32Array) as single argument.
// As this event is handled synchronously,
// you can use this to manipulate the data before it is sent to the LED-Strip.
// strip.beforeRender();

// render: emitted after the data has been sent to the LED-Strip.
// The single argument passed to the handler is the final pixel-data array,
// after index-remapping and gamma-correction.
// strip.render(pixelData);
