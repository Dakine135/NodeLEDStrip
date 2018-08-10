class Pulse{
  constructor(STRIP){
      this.strip = STRIP;
      // this.offset = 0;
      this.end = this.strip.totalLeds;
      this.colorPos = 0;
      this.colorChangeFeq = 10;
      this.autoPulseIndex = 0;
      this.pulses = [];
  }//constructor

  update(delta){

    //clear LEDS and set the end to what color it needs to be
    var i=this.end;
    for (var i=0; i < this.strip.totalLeds; i++)
    {
        if(i >= this.end) this.strip.pixelData[i] = this.strip.colorwheel((this.colorPos + i) % 256);
        else this.strip.pixelData[i] = 0;
    }

    //set color of LED that the AutoPulse is on
    let indexFloor = Math.floor(this.autoPulseIndex);
    this.strip.pixelData[indexFloor] = this.strip.colorwheel((this.colorPos + i) % 256);

    for(var i=0; i < this.pulses.length; i++){

    }

    //if autopulse reaches the end, then reset to begining and increment the end
    if((this.autoPulseIndex + 1) >= this.end){
      this.autoPulseIndex = 0;
      this.end--;
    }

    //move the autopulse down the strip every update
    this.autoPulseIndex = (this.autoPulseIndex + (delta * this.strip.stateSettings.speed));

    //if the entire thing fills up, then reset the end
    if(this.end == 0){
      this.end = this.strip.totalLeds;
    }

    //rotate rainbow
    this.colorPos = (this.colorPos + (this.strip.stateSettings.speed * delta)) % 256;


  }//update

  sendPulse(pulse){
    console.log("SendPulse", pulse);
    this.pulses.push({
        color: pulse.color,
        speed: pulse.speed,
        index: 0
    });
    console.log("this.pulses", this.pulses);
  }//end sendPulse
}

module.exports = Pulse;
