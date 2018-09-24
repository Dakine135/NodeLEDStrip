var http = require('http');
var express = require('express');
var app = express();
var reload = require('reload');
reload(app);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const gameloop = require('node-gameloop');

var NUM_LEDS = 434;
var PORT = 80;
var STRIP = require("./Strip.js");
const isPi = require('detect-rpi');
var strip = new STRIP(isPi(), NUM_LEDS);
strip.changeState('off');
console.log("current State: ", strip.stateName);

// trap the SIGINT and reset before exit
process.on('SIGINT', function ()
{
  strip.reset();
  process.nextTick(function () { process.exit(0); });
});

app.use(express.static('client'));

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(PORT);

// Put a friendly message on the terminal
console.log("Node LED Server running on Port", PORT);

io.on('connect', function(socket){
    console.log("Connection ", socket.id);
    socket.emit("clientUpdate", strip.package(true));

    socket.on('event', function(data){
      console.log("Event: ", data);
      let updateFull = false;
      let key = Object.keys(data)[0];
      switch(key){
        case 'state':
          strip.changeState(data.state);
          updateFull = true;
          break;
        case 'settings':
          strip.updateSettings(data.settings);
          break;
        case 'pulse':
          strip.sendPulse(data.pulse);
          break;
        case 'draw':
          strip.setColor(data.draw.num, data.draw.color);
          break;
        default:
         console.log('unknown event:',data);
      }
      io.emit("clientUpdate", strip.package(updateFull));
    });

    socket.on('tilt', function(data){
      // console.log(data);
      if(strip.stateName == 'tilt'){
        let point = {id: socket.id, y:data.y, x:data.x, color:data.color};
        strip.state.addUpdatePoint(point);
      }
    });

    socket.on('disconnect', function(){
      console.log("Disconect: ", socket.id);
      if(strip.stateName == 'tilt') strip.state.removePoint(socket.id);
    });
});


// start the loop at 30 fps (1000/30ms per frame) and grab its id
let frameCount = 0;
let frameRate = 60; //frames per Second
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
