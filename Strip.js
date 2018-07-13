
class Strip
{
  constructor(NUM_LEDS)
  {
    this.pixelData = new Uint32Array(NUM_LEDS);
    this.totalLeds = NUM_LEDS;
    this.state = null;
    // this.strip = require('./node_modules/rpi-ws281x-native/index.js');
    // this.strip.init(NUM_LEDS);

    // ---- trap the SIGINT and reset before exit
    // process.on('SIGINT', function ()
    // {
    //   this.strip.reset();
    //   process.nextTick(function () { process.exit(0); });
    // });
  } //constructor

  update()
  {
    if(this.state){
      this.state.update();
    }
  }//update

  changeState(stateName)
  {
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
    }//end switch
  }//changeState

} //end Strip Class

module.exports = Strip;
