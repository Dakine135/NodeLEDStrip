// Load the http module to create an http server.
var http = require('http');
// var strip = require('./node_modules/rpi-ws281x-native/index.js');
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


var NUM_LEDS = 150;
pixelData = new Uint32Array(NUM_LEDS);

// strip.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
// process.on('SIGINT', function () {
//   strip.reset();
//   process.nextTick(function () { process.exit(0); });
// });

// for(var i = 0; i < NUM_LEDS; i++) {
//     pixelData[i] = 0xffcc22;
// }
// strip.render(pixelData);

// ---- animation-loop
// var t0 = Date.now();
// setInterval(function () {
//     var dt = Date.now() - t0;
//
//     strip.setBrightness(
//         Math.floor(Math.sin(dt/1000) * 128 + 128));
// }, 1000 / 30);

// beforeRender: emitted just before the data is prepared and sent to the LED-driver.
// The handler will receive the pixel-data array (an Uint32Array) as single argument.
// As this event is handled synchronously,
// you can use this to manipulate the data before it is sent to the LED-Strip.
// strip.beforeRender();

// render: emitted after the data has been sent to the LED-Strip.
// The single argument passed to the handler is the final pixel-data array,
// after index-remapping and gamma-correction.
// strip.render(pixelData);

// // ---- animation-loop
// var offset = 0;
// setInterval(function () {
//   var i=NUM_LEDS;
//   while(i--) {
//       pixelData[i] = 0;
//   }
//   pixelData[offset] = rgb2Int(10, 50, 200);
//
//   offset = (offset + 1) % NUM_LEDS;
//   strip.render(pixelData);
// }, 100);


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






io.on('connection', function(socket){
  socket.emit('request', /* */); // emit an event to the socket
  io.emit('broadcast', /* */); // emit an event to all connected sockets
  socket.on('reply', function(){ /* */ }); // listen to the event
});

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
