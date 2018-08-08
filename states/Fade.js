class Fade{
  constructor(STRIP){
      this.strip = STRIP;
      // this.colors = [0x9b31f7, 0x910a5b];
      this.index = 0;
      this.brightness = 0;
      this.direction = 1;
      // this.strip.stateSettings.speed = 50; //brightness increments per second. 0-255
      this.nextPulse = false;
      this.currColor = this.nextColor();
  }//constructor

  update(delta){

        if(this.nextPulse == true){
          this.currColor = this.nextColor();
          this.nextPulse = false;
        }
        // console.log(this.brightness, this.currColor);

        for(var i = 0; i < this.strip.totalLeds; i++){
            this.strip.pixelData[i] = this.currColor;
        }

        this.brightness = (this.brightness + ((this.strip.stateSettings.speed * delta) * this.direction));

        if(this.brightness >= 255 || this.brightness <= 0)
        {
           this.direction = -this.direction;
        }
        if(this.brightness <= 0) this.nextPulse = true;


        if(this.strip.isRunningOnPi){
          let brightnessFloor = Math.floor(Math.abs(this.brightness));
          this.strip.setBrightness(brightnessFloor);
        }

        // strip.setBrightness(
        //     Math.floor(Math.sin(dt/1000) * 128 + 128));

  }//update


  addColor(color){
    this.strip.stateSettings.colors.push(color);
  }

  nextColor(){
    this.index++;
    if(this.strip.stateSettings.colors.length == 0){
      this.index = 0;
      return this.currColor;
    }
    if(this.index >= this.strip.stateSettings.colors.length){
      this.index = 0;
    }

    let tempColor = this.strip.stateSettings.colors[this.index];
    // console.log("tempColor Raw", tempColor);
    let toInt = parseInt(tempColor.slice(1), 16);
    // console.log("After Parse", toInt);
    return toInt;
  }//end nextColor


}//Fade class

module.exports = Fade;
