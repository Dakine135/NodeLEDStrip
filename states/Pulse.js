class Pulse{
  constructor(STRIP){
      this.strip = STRIP;
      this.offset = 0;
      this.end = this.strip.totalLeds;
      this.colorPos = 0;
      this.colorChangeFeq = 10;
  }//constructor

  update(delta){

    // ---- animation-loop color wheel fast pulses full end
    var i=this.end;
    for (var i=0; i < this.strip.totalLeds; i++)
    {
        if(i >= this.end) this.strip.pixelData[i] = this.strip.colorwheel((this.colorPos + i) % 256);
        else this.strip.pixelData[i] = 0;
    }


    this.strip.pixelData[this.offset] = this.strip.colorwheel((this.colorPos + i) % 256);

    if((this.offset+1) == this.end){
      this.offset = 0;
      this.end--;
    }
    this.offset = (this.offset + 1) % this.strip.totalLeds;
    if(this.end == 0){
      this.end = this.strip.totalLeds;
    }


    if(this.colorChangeFeq == 0)
    {
      this.colorPos = (this.colorPos + 1) % 256;
      this.colorChangeFeq = 10;
    } else this.colorChangeFeq--;


  }//update
}

module.exports = Pulse;
