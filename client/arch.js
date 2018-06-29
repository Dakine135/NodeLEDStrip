class Arch extends PIXI.Sprite{
  constructor(NUM_LEDS){
    super();
    console.log("create Arch #",NUM_LEDS);
    this.numLeds = NUM_LEDS;
    // this.startX = Math.floor(canvas.width * 0.05);
    // this.endX = Math.floor(canvas.width * 0.95);
    // this.height = Math.floor(canvas.height / 4);
    // this.spacing = Math.floor((this.endX - this.startX) / this.numLeds);
    this.thickness = this.spacing * 2;

    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64);
    rectangle.endFill();
    rectangle.x = app.renderer.width/2;
    rectangle.y = app.renderer.height/2;
    app.stage.addChild(rectangle);
  } //end constructor

  setup(){

  }//end setup

  update(){

  }//end update


}//arch class
