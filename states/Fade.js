class Fade{
  constructor(STRIP){
      this.strip = STRIP;
      this.colors = [0x9b31f7, 0x910a5b];
      this.index = 0;
      this.brightness = 0;
      this.direction = 1;
      this.nextPulse = false;
      this.currColor = this.nextColor();
  }//constructor

  update(delta){

        if(this.nextPulse == true){
          this.currColor = this.nextColor();
          this.nextPulse = false;
        }

        for(var i = 0; i < this.strip.totalLeds; i++){
            this.strip.pixelData[i] = this.nextColor;
        }

        this.brightness = this.brightness + this.direction;
        if(this.brightness == 255 || this.brightness == 0)
        {
           this.direction = -this.direction;
        }
        if(this.brightness == 0) this.nextPulse = true;
        // console.log(brightness);
        if(this.strip.isRunningOnPi){
          this.strip.setBrightness(this.brightness);
        }

        // strip.setBrightness(
        //     Math.floor(Math.sin(dt/1000) * 128 + 128));

  }//update


  addColor(color){
    this.colors.push(color);
  }

  nextColor(){
    this.index++;
    if(this.index == this.colors.length){
      this.index = 0;
    }
    return this.colors[this.index];
    //TODO error check to make sure there are colors in the array
  }//end nextColor


}//Fade class

module.exports = Fade;
