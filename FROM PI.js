



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
