
class Strip
{
  constructor(isRunningOnPi, NUM_LEDS)
  {
    this.pixelData = new Uint32Array(NUM_LEDS);
    this.pixelChangesForDraw = [];
    this.totalLeds = NUM_LEDS; //436
    this.state = null;
    this.stateName = 'off';
    this.isRunningOnPi = isRunningOnPi;
    this.strip = null;

    //Dinning side, first by index
    this.dinningSide = {
      start: 0,
      startTop: 60,
      endTop: 157,
      end: 217
    }
    this.dinningSide['toplength'] = this.dinningSide.endTop - this.dinningSide.startTop;
    this.dinningSide['length'] = this.dinningSide.end - this.dinningSide.start + 1;
    console.log(this.dinningSide);

    //Living Room Side, last by index
    this.livingSide = {
      start: 218,
      startTop: 278,
      endTop: 374,
      end: (this.totalLeds - 1)
    }
    this.livingSide['toplength'] = this.livingSide.endTop - this.livingSide.startTop;
    this.livingSide['length'] = this.livingSide.end - this.livingSide.start + 1;
    console.log(this.livingSide);

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
          this.pixelData = new Uint32Array(this.totalLeds);
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
    pos = 255 - Math.floor(pos);
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

  clearPixels(){
    for (var i=0; i < this.totalLeds; i++){
        this.pixelData[i] = 0;
    }
  }

  setBrightness(brightness){
    if(this.isRunningOnPi) this.strip.setBrightness(brightness);
  }

  setColor(num, color){
    // console.log("setColor", num, color);
    if (typeof color == "string") color = parseInt(color.slice(1), 16);
    // console.log(color);
    this.pixelData[num] = color;
    if(this.stateName == "draw"){
      this.pixelChangesForDraw.push(num);
    }
  }

  /**********************
  side:
    dinning or living
  position:
    start, startTop, endTop, end
  offset:
    Integer positive or negative to offset from position index
    also could be a fraction for percentage of that section
  mode:
    single, mirror, reflect
  ***********************/
  drawPixel(side, position, mode, offset, color){
    //console.log("drawPixel", offset, color);
    //get and check side
    let sideConfig;
    if(side === 'dinning') sideConfig = this.dinningSide;
    else if (side === 'living') sideConfig = this.livingSide;
    else throw "Bad side given in drawPixel: "+side+" expecting dinning or living";

    //get and check position
    let intialIndex = sideConfig[position];
    let index = intialIndex;
    if(intialIndex == null || intialIndex == undefined){
      throw "Bad position given in drawPixel: "+position+
      " expecting start, startTop, endTop, end";
    }

    //calculate pixel index
    if(offset > 0 && offset < 1) {
      //does not support negatives
      //offset is a fration and needs to map range based on position and side
      //TODO
    } else {
      index = Math.round(index + offset);
    }

    if(mode != 'single'){
      let otherIndex = this.translatePixelIndex(index, mode);

      if(otherIndex != null) this.setColor(otherIndex, color);
    }
    this.setColor(index, color);
  }

  /**********************
  Currently assumes you are addressing via the dinning Side and
  retuning the translation for the Living side
    index:
      integer
    mode:
      mirror or reflect
  ***********************/
  translatePixelIndex(index, mode){
    //dinning Side count = 217   (0-216)
    //living Side count =  218   (217-435)
    //TODO crude, needs to take into account sides and top and inconsitencies in length
    let translationIndex = null;
    if(mode === 'reflect'){
      translationIndex = this.mapRange(
        index,
        this.dinningSide.start,
        this.dinningSide.end,
        this.livingSide.start,
        this.livingSide.end);
    } else if(mode === 'mirror'){
      if(index > this.dinningSide.start && index < this.dinningSide.startTop){
        //index is on the right start side of dinning
         let fractionUp = this.mapRange(
           index, this.dinningSide.start,
           this.dinningSide.startTop - 1,
           0, 1);
         let fractionOnLivingSideDown = 1 - fractionUp;
         translationIndex = Math.round(this.mapRange(
           fractionOnLivingSideDown,
           0,1,
           this.livingSide.endTop + 1,
           this.livingSide.end
         ));

      } else if(index >= this.dinningSide.startTop && index <= this.dinningSide.endTop){
        //index is on the top side of dinning
      }
    } else throw "Bad mode in translatePixelIndex: "+mode+" expecting mirror or reflect";
    return translationIndex;
  } // end translatePixelIndex

  mapRange(value, low1, high1, low2, high2) {
   return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  package(fullPackage){
    let tempPackage = {
      settings: this.stateSettings.package(),
      stateName: this.stateName
    }
    if(this.stateName == "draw"){
      tempPackage["totalLeds"] = this.totalLeds;
      tempPackage["startTop"] = this.dinningSide.startTop;
      tempPackage["endTop"] = this.dinningSide.endTop;
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
