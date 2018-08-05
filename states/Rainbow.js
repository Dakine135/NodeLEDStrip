class Rainbow{
  constructor(STRIP){
      this.strip = STRIP;
      this.offset = 0;
      this.speed = 100; //in pixel shifts per second
  }//constructor

  update(delta){
    // ---- animation-loop color wheel slow roll
      for (var i = 0; i < this.strip.totalLeds; i++) {
        let offsetFloor = Math.floor(this.offset);
        this.strip.pixelData[i] = this.strip.colorwheel((offsetFloor + i) % 256);
      }
      this.offset = (this.offset + (this.speed * delta)) % 256;
      //test
  }//update
}

module.exports = Rainbow;
