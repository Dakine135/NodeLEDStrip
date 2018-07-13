// Load the http module to create an http server.
var http = require('http');
var strip = require('./node_modules/rpi-ws281x-native/index.js');
var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// io.on('connection', function(){ /* … */ });

app.use(express.static('client'));

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");


var NUM_LEDS = 217;
pixelData = new Uint32Array(NUM_LEDS);

strip.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function ()
{
  strip.reset();
  process.nextTick(function () { process.exit(0); });
});

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





// ---- animation-loop color wheel slow roll
var offset = 0;
setInterval(function () {
  for (var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = colorwheel((offset + i) % 256);
  }

  offset = (offset + 1) % 256;
  strip.render(pixelData);
}, 1000 / 30);

// beforeRender: emitted just before the data is prepared and sent to the LED-driver.
// The handler will receive the pixel-data array (an Uint32Array) as single argument.
// As this event is handled synchronously,
// you can use this to manipulate the data before it is sent to the LED-Strip.
// strip.beforeRender();

// render: emitted after the data has been sent to the LED-Strip.
// The single argument passed to the handler is the final pixel-data array,
// after index-remapping and gamma-correction.
// strip.render(pixelData);

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


// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}






// io.on('connection', function(socket){
//   socket.emit('request', /* */); // emit an event to the socket
//   io.emit('broadcast', /* */); // emit an event to all connected sockets
//   socket.on('reply', function(){ /* */ }); // listen to the event
// });

// io.on('connection', function(client){
//   client.on('event', function(data){});
//   client.on('disconnect', function(){});
// });





// exports = {
//     /**
//      * configures PWM and DMA for sending data to the LEDs.
//      *
//      * @param {Number} numLeds  number of LEDs to be controlled
//      * @param {?Object} options  (acutally only tested with default-values)
//      *                           intialization-options for the library
//      *                           (PWM frequency, DMA channel, GPIO, Brightness)
//      */
//     init: function(numLeds, options) {},
//
//     /**
//      * register a mapping to manipulate array-indices within the
//      * data-array before rendering.
//      *
//      * @param {Array.<Number>} map  the mapping, indexed by destination.
//      */
//     setIndexMapping: function(map) {},
//
//     /**
//      * set the overall-brightness for the entire strip.
//      * This is a fixed scaling applied by the driver when
//      * data is sent to the strip
//      *
//      * @param {Number} brightness the brightness, value from 0 to 255.
//      */
//     setBrightness: function(brightness) {},
//
//     /**
//      * send data to the LED-strip.
//      *
//      * @param {Uint32Array} data  the pixel-data, 24bit per pixel in
//      *                            RGB-format (0xff0000 is red).
//      */
//     render: function(data) {},
//
//     /**
//      * clears all LEDs, resets the PWM and DMA-parts and deallocates
//      * all internal structures.
//      */
//     reset: function() {}
// };
