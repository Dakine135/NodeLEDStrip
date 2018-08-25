class Clock{
  constructor(STRIP){
    this.strip = STRIP;

    //initalize time
    this.time = new Date();
    this.hours = this.time.getHours();
    this.firstDigit = Math.floor(this.hours / 10);
    this.secondDigit = this.hours % 10;
    this.minutes = this.time.getMinutes();
    this.second = 0;
    console.log(this.firstDigit, this.secondDigit, this.minutes);

    //settings for where to display the Clock
    this.startTop = 60;
    this.endTop = 157;
    this.length = this.endTop - this.startTop;
    this.startFirstDigit = this.endTop - 1;
    this.startSecondDigit = this.endTop - 5;
    this.startMinutes = this.startTop + 60;
    this.seperators = [
      this.endTop,        //begin hour
      (this.endTop - 3),  //middle between digits
      (this.endTop - 14),  //end hour
      this.startTop,       //60 minutes
      (this.startTop + 10),  //50 minutes
      (this.startTop + 20),  //40 minutes
      (this.startTop + 30),  //30 minutes
      (this.startTop + 40),  //20 minutes
      (this.startTop + 50), //10 minutes
      (this.startTop + 60)  //0 minutes
    ];

    //colors
    this.seperatorColor = 0x0B7A0F;
    this.blinkingColor = 0xFF3E5E;
    this.hourColor = 0xCACACA;
    this.minuteColor = 0xCACACA;

  }//constructor

  update(delta){
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
    while(this.seconDigit > 0){
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

    //draw seconds
    if(this.second <= 0.5){
      this.strip.pixelData[this.startTop - 2] = this.blinkingColor;
      this.strip.pixelData[this.startTop - 3] = this.blinkingColor;
      this.strip.pixelData[this.endTop + 2] = this.blinkingColor;
      this.strip.pixelData[this.endTop + 3] = this.blinkingColor;
    }


  }//update

  updateTime(){
    // console.log("updateTime");
    this.time = new Date();
    this.hours = this.time.getHours();
    this.firstDigit = Math.floor(this.hours / 10);
    this.secondDigit = this.hours % 10;
    this.minutes = this.time.getMinutes();
  }


}

module.exports = Clock;
