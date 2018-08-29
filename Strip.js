
class Strip
{
  constructor(isRunningOnPi, NUM_LEDS)
  {
    this.pixelData = new Uint32Array(NUM_LEDS);
    this.totalLeds = NUM_LEDS;
    this.state = null;
    this.stateName = 'off';
    this.isRunningOnPi = isRunningOnPi;
    this.strip = null;

    this.startTop = 60;
    this.endTop = 157;
    this.toplength = this.endTop - this.startTop;

    //settings for states
    let STATESETTINGS = require("./states/stateSettings.js");
    this.stateSettings = new STATESETTINGS();

    if(this.isRunningOnPi){
      this.strip = require('./node_modules/rpi-ws281x-native/index.js');
      this.strip.init(NUM_LEDS);
    }//if running on Pi
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
    console.log("change State to: ", stateName, " From ", this.stateName);
    if(stateName == this.stateName){
      console.log("Same State, dont change");
    } else {
      this.setBrightness(255);
      switch(stateName){
        case "off":
          this.state = null;
          this.stateName = 'off';
          this.pixelData = new Uint32Array(this.totalLeds);
          if(this.isRunningOnPi) this.strip.render(this.pixelData);
          // this.reset();
          break;
        case "rainbow":
          let RAINBOW = require("./states/Rainbow.js");
          this.state = new RAINBOW(this);
          this.stateName = 'rainbow';
          break;
        case "fade":
          let FADE = require("./states/Fade.js");
          this.state = new FADE(this);
          this.stateName = 'fade';
          break;
        case "pulse":
          let PULSE = require("./states/Pulse.js");
          this.state = new PULSE(this);
          this.stateName = 'pulse';
          break;
        case "tilt":
          let TILT = require("./states/Tilt.js");
          this.state = new TILT(this);
          this.stateName = 'tilt';
          break;
        case "pong":
          let PONG = require("./states/Pong.js");
          this.state = new PONG(this);
          this.stateName = 'pong';
          break;
        case "clock":
          let CLOCK = require("./states/Clock.js");
          this.state = new CLOCK(this);
          this.stateName = 'clock';
          break;
        case "draw":
          let DRAW = require("./states/Draw.js");
          this.state = new DRAW(this);
          this.stateName = 'draw';
          break;
        default:
          console.log("invalid stateName");
      }//end switch
    }
  }//changeState

  updateSettings(data){
    this.stateSettings.update(data);
  }

  sendPulse(pulse){
    if(this.stateName == 'pulse'){
      this.state.sendPulse(pulse);
    }
  }

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

  reset(){
    if(this.isRunningOnPi) this.strip.reset();
  }

  setBrightness(brightness){
    if(this.isRunningOnPi) this.strip.setBrightness(brightness);
  }

  package(){
    let tempPackage = {
      settings: this.stateSettings.package(),
      stateName: this.stateName
    }
    return tempPackage;
  }

} //end Strip Class

module.exports = Strip;
