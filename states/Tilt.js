class Tilt{
  constructor(STRIP){
      this.strip = STRIP;
      this.points = {};
  }//constructor

  update(delta){
    //wipe all
    for (var i=0; i < this.strip.totalLeds; i++){
        this.strip.pixelData[i] = 0;
    }

    for(var clientId in this.points) {
      // console.log("this.points:", this.points);
      let y = this.points[clientId].y;
      let ledIndex = this.map_range(y, 0, 180, 0, this.strip.totalLeds);
      this.strip.pixelData[i] = 0xFFFFFF;
    }


  }//update

  addUpdatePoint(point){
    this.points[point.id] = point.y
  }

  removePoint(pointId){

  }

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

}

module.exports = Tilt;
