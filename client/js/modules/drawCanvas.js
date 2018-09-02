class Box{
  constructor(id, loc, num, x, y, size, leds, render){
    this.type = "Box";
    this.id = id;
    this.loc = loc;
    this.num = num;
    this.x = x;
    this.y = y;
    this.size = size;
    this.leds = leds;
    this.render = render;
    this.selected = false;
  }

  draw(){
    this.render.beginPath();
    if(this.selected){
      this.render.lineWidth="2";
      this.render.strokeStyle="yellow";
      this.leds.forEach((led)=>{
        this.render.fillStyle = led.color;
        this.render.fillRect(led.x, led.y, led.size, led.size);
        this.render.fillStyle = "yellow";
        this.render.strokeRect(led.x, led.y, led.size, led.size);
        this.render.font = "30px Arial";
        this.render.fillStyle = "white";
        this.render.fillText(led.num,led.x,(led.y + (led.size/2)));
      });
      // console.log(this.leds);
    } else {
      this.render.lineWidth="1";
      this.render.strokeStyle="green";
    }

    this.render.rect(this.x, this.y, this.size, this.size);
    this.render.stroke();
  }

  toggleSelected(){
    this.selected = !this.selected;
  }

  clicked(x, y){
    if(x > this.x && x < (this.x + this.size) &&
       y > this.y && y < (this.y + this.size)
     ){
      return this;
    } else return null;
  }//end clicked

  toString(){
    let tempString = `ID ${this.id} ${this.loc}${this.num}`;
    return tempString;
  }
}//end Box class

class Led{
  constructor(num, x, y, size, color){
    this.type = "Led";
    this.num = num;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  clicked(x, y){
    if(x > this.x && x < (this.x + this.size) &&
       y > this.y && y < (this.y + this.size)
     ){
      return this;
    } else return null;
  }

  toString(){
    return "Led"+this.num;
  }
}//Led class

Vue.component('draw-canvas', {
  template: `
    <canvas id="drawCanvas" width="200" height="100" style="border:1px solid #ffffff;">
    </canvas>
  `,
  data: function(){
    return {
      canvas: null,
      render: null,
      boxes: {},
      currentSelection: null
    }
  },
  mounted(){
    this.canvas = document.getElementById("drawCanvas");
    this.render = this.canvas.getContext("2d");

    this.canvas.width = screen.width;
    this.canvas.height = screen.height * 0.85;
    // console.log(this.canvas);

    this.canvas.addEventListener('touchstart', function(e) {
      var rect = this.canvas.getBoundingClientRect(), // abs. size of element
      scaleX = this.canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = this.canvas.height / rect.height;  // relationship bitmap vs. element for Y

      let touchPos = {
        x: (e.touches[0].pageX - rect.left) * scaleX,
        y: (e.touches[0].pageY - rect.top) * scaleY
      };
      // console.log(touchPos);
      this.render.lineWidth="1";
      this.render.strokeStyle="yellow";
      this.render.beginPath();
      this.render.rect(touchPos.x, touchPos.y, 2, 2);
      this.render.stroke();

      let clickedBox = this.getClicked(touchPos.x, touchPos.y);

      if(clickedBox){
        console.log(clickedBox.toString());
        this.handleClicked(clickedBox);
       }
    }.bind(this), false);

    //create the boxes
    let margin = 5;
    let numInSection = 6;
    let sectionSize = 70;
    var indexId = 0;

    let numTop = this.$root.endTop - this.$root.startTop;
    console.log(numTop);
    let topSecionsCount = Math.ceil((numTop) / numInSection);
    console.log(topSecionsCount);
    let topSize = Math.floor((this.canvas.height - (margin)) / topSecionsCount);
    for(var i=0; i<topSecionsCount; i++){
      let tempId = indexId;
      indexId++;

      //create Led sections
      let tempLeds = [];
      let numOfLeds = numInSection;
      if(numTop < numInSection) numOfLeds = numTop;
      let startOffset = (numOfLeds * sectionSize) / 2;
      for(var f=0; f<numInSection && numTop>0; f++){
        let tempLed = new Led(
          ((this.$root.endTop - (i*numInSection))-f),
          ((this.canvas.width / 2) - (sectionSize/4)),
          ((this.canvas.height / 2) - (sectionSize/4) + (f*sectionSize) - startOffset),
          sectionSize,
          "#999999");
        tempLeds.push(tempLed);
        numTop--;
      }

      let tempBox = new Box(tempId, "Top", i,
        (this.canvas.width - topSize - margin),
        ((margin) + (topSize*i)),
        topSize,
        tempLeds,
        this.render
      );
      this.boxes[tempId] = tempBox;
    }

    let numLeft = this.$root.totalLeds - this.$root.endTop;
    console.log(numLeft);
    let leftSecionsCount = Math.ceil((numLeft) / numInSection);
    let leftSideSize = (this.canvas.width - (3*margin) - topSize) / leftSecionsCount;
    for(var i=0; i<leftSecionsCount; i++){
      let tempId = indexId;
      indexId++;
      //create Led sections
      let tempLeds = [];
      let numOfLeds = numInSection;
      if(numLeft < numInSection) numOfLeds = numLeft;
      let startOffset = (numOfLeds * sectionSize) / 2;
      for(var f=0; f<numInSection && numLeft>0; f++){
        let tempLed = new Led(
          ((this.$root.totalLeds - (i*numOfLeds))-f),
          ((this.canvas.width / 2) - (sectionSize/4)),
          ((this.canvas.height / 2) - (sectionSize/4) + (f*sectionSize) - startOffset),
          sectionSize,
          "#999999");
        tempLeds.push(tempLed);
        numLeft--;
      }
      let tempBox = new Box(tempId, "Left", i,
        (margin+(i*leftSideSize)),
        margin,
        leftSideSize,
        tempLeds,
        this.render
      );
      this.boxes[tempId] = tempBox;
    }

    let numRight = this.$root.startTop;
    console.log(numRight);
    let rightSecionsCount = Math.ceil((numRight) / numInSection);
    let rightSideSize = (this.canvas.width - (3*margin) - topSize) / rightSecionsCount;
    for(var i=0; i<rightSecionsCount; i++){
      let tempId = indexId;
      indexId++;
      //create Led sections
      let tempLeds = [];
      let numOfLeds = numInSection;
      if(numRight < numInSection) numOfLeds = numRight;
      let startOffset = (numOfLeds * sectionSize) / 2;
      for(var f=0; f<numInSection && numRight>0; f++){
        let tempLed = new Led(
          ((i*numOfLeds)+f),
          ((this.canvas.width / 2) - (sectionSize/4)),
          ((this.canvas.height / 2) - (sectionSize/4) + (f*sectionSize) - startOffset),
          sectionSize,
          "#999999");
        tempLeds.push(tempLed);
        numRight--;
      }
      let tempBox = new Box(tempId, "Right", i,
        (margin+(i*rightSideSize)),
        (this.canvas.height - margin - rightSideSize),
        rightSideSize,
        tempLeds,
        this.render
      );
      this.boxes[tempId] = tempBox;
    }

    //draw all boxes
    this.draw();

    // TODO figure out how to disable swipe
    // this.$root._data.f7params.panel.swipe = 'false';
    // console.log(this.$root);
  },
  methods: {
    draw: function(){
      this.render.fillStyle = "black";
      this.render.fillRect(0, 0, this.canvas.width, this.canvas.height);
      Object.entries(this.boxes).forEach((box)=>{
        // console.log(box);
        box[1].draw();
      });
    },
    getClicked: function(x, y){
      let boxes = Object.entries(this.boxes);
      let tempClicked = null;
      for(var i=0; i< boxes.length && tempClicked == null; i++){
        // console.log(box);
        tempClicked = boxes[i][1].clicked(x, y);
      };
      if(this.currentSelection != null){
        for(var i=0; i< this.currentSelection.leds.length && tempClicked == null; i++){
          // console.log(box);
          tempClicked = this.currentSelection.leds[i].clicked(x, y);
        };
      }
      return tempClicked;
    },
    handleClicked: function(clicked){
      if(clicked.type == "Box"){
        if(this.currentSelection != null){
          this.currentSelection.selected = false;
        }
        this.currentSelection = clicked;
        clicked.selected = true;
      } else if(clicked.type == "Led"){
        console.log("Clicked: ", clicked);
        socket.emit('event', {draw: {num: clicked.num, color: clicked.color}});
      } else console.log("Error in clicked type");
      this.draw();
    }//handle Clicked
  }
});
