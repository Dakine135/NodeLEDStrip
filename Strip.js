
class Strip
{
  constructor(isRunningOnPi, NUM_LEDS)
  {
    this.pixelData = new Uint32Array(NUM_LEDS);
    this.totalLeds = NUM_LEDS;
    this.state = null;
    this.isRunningOnPi = isRunningOnPi;
    this.strip = null;
    if(this.isRunningOnPi){
      this.strip = require('./node_modules/rpi-ws281x-native/index.js');
      this.strip.init(NUM_LEDS);

      // trap the SIGINT and reset before exit
      process.on('SIGINT', function ()
      {
        this.strip.reset();
        process.nextTick(function () { process.exit(0); });
      });
    }
  } //constructor

  update(delta)
  {
    // console.log("timePassed: ", delta);
    if(this.state){
      this.state.update(delta);
      if(this.strip){
        this.strip.render(this.pixelData);
      }
    }
  }//update

  changeState(stateName)
  {
    console.log("change State to: ", stateName);
    switch(stateName){
      case "off":
        this.state = null;
        break;
      case "rainbow":
        let RAINBOW = require("./states/Rainbow.js");
        this.state = new RAINBOW(this);
        break;
      case "fade":
        let FADE = require("./states/Fade.js");
        this.state = new FADE(this.totalLeds);
        break;
      case "pulse":
        let PULSE = require("./states/Pulse.js");
        this.state = new PULSE(this.totalLeds);
        break;
      default:
        console.log("invalid stateName");
    }//end switch
  }//changeState

  // rainbow-colors, taken from http://goo.gl/Cs3H0v
  colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) { return this.rgb2Int(255 - pos * 3, 0, pos * 3); }
    else if (pos < 170) { pos -= 85; return this.rgb2Int(0, pos * 3, 255 - pos * 3); }
    else { pos -= 170; return this.rgb2Int(pos * 3, 255 - pos * 3, 0); }
  }

  rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  }

} //end Strip Class

module.exports = Strip;
