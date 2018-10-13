class Rainbow{
  constructor(STRIP){
      this.strip = STRIP;
      this.offset = 0;
      // this.speed = 100; //in pixel shifts per second
  }//constructor

  update(delta){
    // ---- animation-loop color wheel slow roll
      // for (var i = 0; i < this.strip.dinningSide.length; i++) {
      //   let offsetFloor = Math.floor(this.offset);
      //   let color = this.strip.colorwheel((offsetFloor + i) % 256);
      //   this.strip.drawPixel('dinning', 'start', 'mirror', i, color);
      // }
      // this.offset = (this.offset + (this.strip.stateSettings.speed * delta)) % 256;

      Object.keys(this.strip.dinningSide).forEach((key) => (){
        console.log(key);
      }


  }//update
}

module.exports = Rainbow;
