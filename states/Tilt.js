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
      let point = this.points[clientId];
      let move = Math.ceil(point.goal - point.index);
      point.index = point.index + move;
      // console.log(clientId, y, ledIndex);
      this.strip.pixelData[point.index] = point.color;
      if(point.index != 0) this.strip.pixelData[point.index-1] = point.color;
      if(point.index != this.strip.totalLeds) this.strip.pixelData[point.index+1] = point.color;
    }


  }//update

  addUpdatePoint(point){
    let ledIndex = Math.floor(this.strip.totalLeds - this.map_range(point.y, 0, 180, 0, this.strip.totalLeds));
    if(this.points[point.id] == null){
      this.points[point.id] = {
        goal: ledIndex,
        index: ledIndex,
        color: 0xFFFFFF
      };
    } else {
      this.points[point.id].goal = ledIndex;
    }

  }

  removePoint(pointId){
    if(this.points[point.id] != null){
      delete this.points[point.id];
    }
  }

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

}

module.exports = Tilt;
