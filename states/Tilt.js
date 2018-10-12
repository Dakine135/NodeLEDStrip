class Tilt{
  constructor(STRIP){
      this.strip = STRIP;
      this.points = {};
  }//constructor

  update(delta){
    //wipe all
    this.strip.clearPixels();

    for(var clientId in this.points) {
      let point = this.points[clientId];
      let move = Math.ceil(point.goal - point.index);
      point.index = point.index + move;
      // console.log(clientId, y, ledIndex);
      this.strip.drawPixel('dinning', 'start', 'mirror', point.index, point.color);
      if(point.index != 0) this.strip.drawPixel('dinning', 'start', 'mirror', point.index-1, point.color);
      if(point.index != this.strip.dinningSide.length) this.strip.drawPixel('dinning', 'start', 'mirror', point.index+1, point.color);
    }


  }//update

  addUpdatePoint(point){
    // console.log(point);
    let ledIndex = Math.floor(this.strip.dinningSide.length - this.map_range(point.y, 0, 180, 0, this.strip.dinningSide.length));
    if(this.points[point.id] == null){
      this.points[point.id] = {
        goal: ledIndex,
        index: ledIndex,
        color: 0xFFFFFF
      };
    } else {
      this.points[point.id].goal = ledIndex;
      if(point.color != null){
        this.points[point.id].color = parseInt(point.color.slice(1), 16);
      }
    }
  }

  removePoint(pointId){
    if(this.points[pointId] != null){
      delete this.points[pointId];
    }
  }

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

}

module.exports = Tilt;
