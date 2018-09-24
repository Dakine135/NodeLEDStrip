
class Strip
{
  constructor(isRunningOnPi, NUM_LEDS)
  {
    this.pixelData = new Uint32Array(NUM_LEDS);
    this.pixelChangesForDraw = [];
    this.totalLeds = NUM_LEDS; //434
    this.state = null;
    this.stateName = 'off';
    this.isRunningOnPi = isRunningOnPi;
    this.strip = null;

    //Dinning side, first by index
    this.start = 0;
    this.end = 216;
    this.startTop = 60;
    this.endTop = 157;
    this.toplength = this.endTop - this.startTop;

    //Living Room Side, last by index
    this.start2 = 217;
    this.end2 = 433
    this.startTop2 = 277;
    this.endTop2 = 374;
    this.toplength2 = this.endTop - this.startTop;
    //97 length top


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

  int2Rgb(int){
    var red = int >> 16;
    var green = int - (red << 16) >> 8;
    var blue = int - (red << 16) - (green << 8);

    return {
      red: red,
      green: green,
      blue: blue
    }
  }

  reset(){
    if(this.isRunningOnPi) this.strip.reset();
  }

  setBrightness(brightness){
    if(this.isRunningOnPi) this.strip.setBrightness(brightness);
  }

  setColor(num, color){
    console.log("setColor", num, color);
    if (typeof color == "string") color = parseInt(color.slice(1), 16);
    console.log(color);
    this.pixelData[num] = color;
    this.pixelChangesForDraw.push(num);
  }

  package(fullPackage){
    let tempPackage = {
      settings: this.stateSettings.package(),
      stateName: this.stateName
    }
    if(this.stateName == "draw"){
      tempPackage["totalLeds"] = this.totalLeds;
      tempPackage["startTop"] = this.startTop;
      tempPackage["endTop"] = this.endTop;
      if(fullPackage) tempPackage["pixelData"] = this.pixelData;
      else {
        //only send changes
        tempPackage["pixelData"] = {};
        this.pixelChangesForDraw.forEach((change)=>{
          tempPackage["pixelData"][change] = this.pixelData[change];
        });

        this.pixelChangesForDraw = [];
      }
    }//if in draw
    return tempPackage;
  }

} //end Strip Class

module.exports = Strip;
