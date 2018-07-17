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
      console.log("Event: ", data);
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



// ---- animation-loop for pulse brightness
// var t0 = Date.now();
var pulseDelay = 0.1;
let MaeColor = 0x9b31f7;
let EdaColor = 0x910a5b
var colorArray = [MaeColor, EdaColor];
var colorSet = new ColorSet(colorArray);
var brightness = 0;
var direction = 1;
var nextPulse = false;
var nextColor = colorSet.nextColor();
// setInterval(function ()
// {
//     // var dt = Date.now() - t0;
//
//     if(nextPulse == true)
//     {
//       nextColor = colorSet.nextColor();
//       nextPulse = false;
//     }
//
//
//     for(var i = 0; i < NUM_LEDS; i++)
//     {
//         pixelData[i] = nextColor;
//     }
//
//     strip.render(pixelData);
//
//     brightness = brightness + direction;
//     if(brightness == 255 || brightness == 0)
//     {
//        direction = -direction;
//     }
//     if(brightness == 0) nextPulse = true;
//     // console.log(brightness);
//     strip.setBrightness(brightness);
//
//     // strip.setBrightness(
//     //     Math.floor(Math.sin(dt/1000) * 128 + 128));
// }, pulseDelay);  //1000 / pulseDelay
//////////////////////////////////////////////////
//////////////////////////////////////////////////







// ---- animation-loop color wheel slow roll
// var offset = 0;
// setInterval(function () {
//   for (var i = 0; i < NUM_LEDS; i++) {
//     pixelData[i] = colorwheel((offset + i) % 256);
//   }
//
//   offset = (offset + 1) % 256;
//   strip.render(pixelData);
// }, 1000 / 30);



// ---- animation-loop color wheel fast pulses full end
// var offset = 0;
// var end = NUM_LEDS;
// var colorPos = 0;
// var colorChangeFeq = 10;
// setInterval(function () {
//   var i=end;
//   for (var i=0; i < NUM_LEDS; i++)
//   {
//       if(i >= end) pixelData[i] = colorwheel((colorPos + i) % 256);
//       else pixelData[i] = 0;
//   }
//
//
//   pixelData[offset] = colorwheel((colorPos + i) % 256);
//
//   if((offset+1) == end){
//     offset = 0;
//     end--;
//   }
//   offset = (offset + 1) % NUM_LEDS;
//   if(end == 0){
//     end = NUM_LEDS;
//   }
//
//
//   if(colorChangeFeq == 0)
//   {
//     colorPos = (colorPos + 1) % 256;
//     colorChangeFeq = 10;
//   } else colorChangeFeq--;
//
//   // console.log("end/offser:" , end, offset);
//   strip.render(pixelData);
// }, 0.1);


function ColorSet(arrayOfColors)
{
  this.colors = arrayOfColors;
  this.index = 0;

  this.addColor = (color) =>
  {
    this.colors.push(color);
  }

  this.nextColor = () =>
  {
    this.index++;
    if(this.index == this.colors.length){
      this.index = 0;
    }
    return this.colors[this.index];
    //TODO error check to make sure there are colors in the array
  }//end nextColor
}// colorSet Class


// beforeRender: emitted just before the data is prepared and sent to the LED-driver.
// The handler will receive the pixel-data array (an Uint32Array) as single argument.
// As this event is handled synchronously,
// you can use this to manipulate the data before it is sent to the LED-Strip.
// strip.beforeRender();

// render: emitted after the data has been sent to the LED-Strip.
// The single argument passed to the handler is the final pixel-data array,
// after index-remapping and gamma-correction.
// strip.render(pixelData);
