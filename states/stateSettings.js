class stateSettings{
  constructor(){
      this.speed = 50; //in changes per second
      this.colors = ["#9b31f7", "#910a5b", "#ad2b14", "#adc92c", "#ce46d4"];
  }//constructor

  update(data){
    let keys = Object.keys(data);
    for(var i=0; i<keys.length; i++){
      switch(keys[i]){
        case 'speed':
          console.log("update Speed to", data.speed);
          this.speed = data.speed;
          break;
        case 'addColor':
          this.addColor(data.addColor);
          break;
        case 'removeColor':
          this.removeColor(data.removeColor);
          break;
        default:
          console.log("unkown settings update:", keys[i]);
      }
    }
  }

  addColor(color){
    console.log("addColor: ", color);
    this.colors.push(color);
  }

  getIndexOfColor(color){
    let index = this.colors.indexOf(color);
    console.log("index of Color", color, "is", index);
    if(index < 0) return null;
    return index;
  }

  removeColor(color){
    let index = this.getIndexOfColor(color);
    console.log("RemoveColor ", color, "at", index);
    if(index != null) this.colors.splice(index, 1);
  }

  package(){
    let tempPackage = {
      speed: this.speed,
      colors: this.colors
    }
    // console.log(this.colors);
    return tempPackage;
  }


}

module.exports = stateSettings;
