class Rainbow{
  constructor(STRIP){
      this.strip = STRIP;
      this.offset = 0;
  }//constructor

  update(delta){
    // ---- animation-loop color wheel slow roll
      for (var i = 0; i < this.strip.totalLeds; i++) {
        this.strip.pixelData[i] = this.strip.colorwheel((this.offset + i) % 256);
      }
      this.offset = (this.offset + 1) % 256;
  }//update
}

module.exports = Rainbow;
