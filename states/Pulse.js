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
    var tempEnd=this.end;
    for (var i=0; i < this.strip.totalLeds; i++)
    {
        if(i >= this.end) this.strip.pixelData[i] = this.strip.colorwheel((this.colorPos + i) % 256);
        else this.strip.pixelData[i] = 0;
    }

    //draw autopulse
    let indexFloor = Math.floor(this.autoPulseIndex);
    this.strip.pixelData[indexFloor] = this.strip.colorwheel((this.colorPos + tempEnd) % 256);
    //move the autopulse down the strip every update
    this.autoPulseIndex = this.autoPulseIndex + (delta * this.strip.stateSettings.speed);
    //if autopulse reaches the end, then reset to begining and increment the end
    if(this.autoPulseIndex >= this.end){
      this.autoPulseIndex = 0;
      this.end--;
    }

    //remove finished client Pulses signified by index -1
    var deleteIndex = 0;
    while(deleteIndex < this.pulses.length){
      if(this.pulses[deleteIndex].index == -1){
        console.log("delete pulse", this.pulses[deleteIndex]);
        console.log("this.pulses",this.pulses);
        this.pulses.splice(deleteIndex, 1);
      } else {
        deleteIndex++;
      }
    }

    //client Pulses
    for(var i=0; i < this.pulses.length; i++){
      //draw at index
      let indexFloor = Math.floor(this.pulses[i].index);
      // console.log("draw at ", index, this.pulses[i]);
      this.strip.pixelData[indexFloor] = parseInt(this.pulses[i].color.slice(1), 16);
      //increment based in its speed
      this.pulses[i].index = this.pulses[i].index + (delta * this.pulses[i].speed);
      //test for End
      if(this.pulses[i].index >= this.end){
        this.pulses[i].index = -1;
        this.end--;
      }
    }





    //if the entire thing fills up, then reset the end
    if(this.end == 0){
      this.end = this.strip.totalLeds;
    }

    //rotate rainbow
    this.colorPos = (this.colorPos + (this.strip.stateSettings.speed * delta)) % 256;


  }//update

  sendPulse(pulse){
    console.log("create Pulse", pulse);
    this.pulses.push({
        color: pulse.color,
        speed: pulse.speed,
        index: 0
    });
    // console.log("this.pulses", this.pulses);
  }//end sendPulse
}

module.exports = Pulse;
