class Clock{
  constructor(STRIP){
    this.strip = STRIP;

    //initalize time
    this.time = new Date();
    this.hours = this.time.getHours();
    this.firstDigit = Math.floor(this.hours / 10);
    this.secondDigit = this.hours % 10;
    this.minutes = this.time.getMinutes();
    this.seconds = this.time.getSeconds();
    this.second = 0;
    console.log(this.firstDigit, this.secondDigit, this.minutes);

    //settings for where to display the Clock
    this.startFirstDigit = this.strip.endTop - 1;
    this.startSecondDigit = this.strip.endTop - 4;
    this.startMinutes = this.strip.startTop + 59;
    this.leftRangeSeconds = this.strip.totalLeds - (this.strip.endTop + 1);
    this.rightRangeSeconds = this.strip.startTop - 1;
    this.seperators = [
      this.strip.endTop,        //begin hour
      (this.strip.endTop - 3),  //middle between digits
      (this.strip.endTop - 14),  //end hour
      this.strip.startTop,       //60 minutes
      (this.strip.startTop + 10),  //50 minutes
      (this.strip.startTop + 20),  //40 minutes
      (this.strip.startTop + 30),  //30 minutes
      (this.strip.startTop + 40),  //20 minutes
      (this.strip.startTop + 50), //10 minutes
      (this.strip.startTop + 60)  //0 minutes
    ];
    this.seperatorOverwrite = null;

    //colors
    this.seperatorColor = 0x0B7A0F;
    this.blinkingColor = 0xFF3E5E;
    this.hourColor = 0xCACACA;
    this.minuteColor = 0xCACACA;

    //for second Drop
    this.secondsDropOn = true;
    this.secondsDroping = false;
    this.secPos = 100;

  }//constructor

  update(delta){
    //calculate in-between seconds
    this.second = this.second + delta;
    if(this.second >= 1){
      // console.log(this.second);
      this.second = 0;
    }

    //wipe all
    for (var i=0; i < this.strip.totalLeds; i++){
        this.strip.pixelData[i] = 0;
    }

    this.updateTime();

    //check if minute falls on a seperator
    if((this.minutes % 10) == 0){
      this.seperatorOverwrite = this.startFirstDigit + this.minutes;
    } else this.seperatorOverwrite = null;

    //draw time pixels
    // console.log("draw first digit");
    let offset = 0;
    while(this.firstDigit > 0){
      this.strip.pixelData[this.startFirstDigit - offset] = this.hourColor;
      this.firstDigit--;
      offset++;
    }
    // console.log("draw second digit");
    offset = 0;
    while(this.secondDigit > 0){
      this.strip.pixelData[this.startSecondDigit - offset] = this.hourColor;
      this.secondDigit--;
      offset++;
    }
    // console.log("draw minutes");
    offset = 0;
    while(this.minutes > 0){
      this.strip.pixelData[this.startMinutes - offset] = this.minuteColor;
      this.minutes--;
      offset++;
    }

    //draw seperators
    this.seperators.forEach(function(seperator){
      this.strip.pixelData[seperator] = this.seperatorColor;
    }.bind(this));

    //code to draw if minute falls on a seperator
    if(this.seperatorOverwrite != null){
      let sepColorRGB = this.strip.int2Rgb(this.seperatorColor);
      let minColorRGB = this.strip.int2Rgb(this.minuteColor);
      let newColor = {
        red: Math.abs(sepColorRGB.red - minColorRGB.red),
        green: Math.abs(sepColorRGB.green - minColorRGB.green),
        blue: Math.abs(sepColorRGB.blue - minColorRGB.blue)
      }

      this.strip.pixelData[this.seperatorOverwrite] = this.strip.rgb2Int(newColor.red, newColor.green, newColor.blue);
    }

    //draw seconds
    if(this.secondsDropOn && this.secondsDroping){
      let leftSecPos = this.mapRange(this.secPos, 0, 100, 0, this.leftRangeSeconds);
      let leftIndex = this.strip.totalLeds - leftSecPos;
      let rightSecPos = this.mapRange(this.secPos, 0, 100, 0, this.rightRangeSeconds);
      this.strip.pixelData[leftIndex] = this.blinkingColor;
      this.strip.pixelData[rightSecPos] = this.blinkingColor;
      this.secPos--;
      if(this.secPos <= 0) this.secondsDroping = false;
    }else{
      if(this.second <= 0.5){
        let leftOffset = this.mapRange(this.seconds, 0, 59, 0, this.leftRangeSeconds);
        let leftIndex = this.strip.totalLeds - leftOffset;
        let rightOffset = this.mapRange(this.seconds, 0, 59, 0, this.rightRangeSeconds);
        this.strip.pixelData[leftIndex] = this.blinkingColor;
        this.strip.pixelData[rightOffset] = this.blinkingColor;
      }
    }
    if(this.secondsDropOn && this.seconds >= 59){
      this.secondsDroping = true;
      this.secPos = 100;
    }

  }//update

  updateTime(){
    // console.log("updateTime");
    this.time = new Date();
    this.hours = this.time.getHours();
    this.firstDigit = Math.floor(this.hours / 10);
    this.secondDigit = this.hours % 10;
    this.minutes = this.time.getMinutes();
    let lastSecond = this.seconds;
    this.seconds = this.time.getSeconds();
    if(lastSecond != this.seconds) console.log(this.firstDigit, this.secondDigit, this.minutes, this.seconds);
  }

  mapRange(value, low1, high1, low2, high2) {
   return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }


}

module.exports = Clock;
