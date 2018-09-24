class Draw{
  constructor(STRIP){
    this.strip = STRIP;
    this.pixelData = new Uint32Array(this.strip.totalLeds);
  }//constructor

  update(delta){

  }//update
}

module.exports = Draw;
