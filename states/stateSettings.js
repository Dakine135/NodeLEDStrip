class stateSettings{
  constructor(){
      this.speed = 100; //in changes per second
      this.colors = [0x9b31f7, 0x910a5b];
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
          break;
        default:
          console.log("unkown settings update");
      }
    }
  }


}

module.exports = stateSettings;
