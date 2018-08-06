class stateSettings{
  constructor(){
      this.speed = 100; //in changes per second
      this.colors = [0x9b31f7, 0x910a5b];
  }//constructor

  changeSpeed(newSpeed){
    this.speed = newSpeed;
  }


}

module.exports = stateSettings;
