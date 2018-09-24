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
    this.gradient = null;
  }

  draw(){
    this.render.save();
    this.render.beginPath();
    if(this.selected){
      this.render.lineWidth="2";
      this.render.strokeStyle="yellow";
      this.leds.forEach((led)=>{
        led.draw(this.render);
      });
      // console.log(this.leds);
    } else {
      this.render.lineWidth="1";
      this.render.strokeStyle="green";
    }

    // Create gradient
    let numOfLeds = this.leds.length;
    let increment = 1 / numOfLeds;

    switch(this.loc){
      case "Left":
        this.gradient=this.render.createLinearGradient(
          this.x, this.y,
          this.x + this.size, this.y
        );
        break;
      case "Top":
        this.gradient=this.render.createLinearGradient(
          this.x, this.y,
          this.x, this.y + this.size
        );
        break;
      case "Right":
        this.gradient=this.render.createLinearGradient(
          this.x,this.y,
          this.x + this.size, this.y
        );
        break;
      default:
        console.log("Error in gradient Switch");
    }

    for(var i=0; i<numOfLeds; i++){
      this.gradient.addColorStop(((i*increment) +(i*(increment/numOfLeds))),this.leds[i].color);
    }
    this.render.fillStyle = this.gradient;

    this.render.fillRect(this.x, this.y, this.size, this.size);
    this.render.strokeRect(this.x, this.y, this.size, this.size);
    this.render.restore();
    // this.render.stroke();
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

  draw(render){
    render.fillStyle = this.color;
    render.fillRect(this.x, this.y, this.size, this.size);
    render.strokeStyle = "yellow";
    render.strokeRect(this.x, this.y, this.size, this.size);
    render.save();
    render.translate(this.x, this.y);
    render.rotate(Math.PI / 2);
    render.font = "30px Arial";
    render.fillStyle = "white";
    render.lineWidth=1;
    render.strokeStyle = "black";
    render.textAlign = "center";
    render.fillText(this.num, (this.size / 2), -(this.size / 2.5));
    render.strokeText(this.num, (this.size / 2), -(this.size / 2.5));
    render.restore();
  }

  changeColor(color){
    console.log(color);
    if(this.color != color){
      this.color = color;
      socket.emit('event', {draw: {num: this.num, color: this.color}});
    }
  }

  toString(){
    return "Led"+this.num;
  }
}//Led class

class Button{
  constructor(x, y, size, text, color, render, callBack){
    console.log("new button ",color);
    this.type = "Button";
    this.font = "20px Arial";
    this.margin = 3;
    this.x = x;
    this.y = y;
    this.size = size;
    this.text = text;
    this.color = color;
    this.render = render;
    this.render.font = this.font;
    this.width = this.render.measureText(this.text).width;
    this.callBack = callBack;
  }

  clicked(x, y){
    if(x > this.x && x < (this.x + this.size) &&
       y > this.y && y < (this.y + (this.width + (this.margin * 2)))
     ){
      return this;
    } else return null;
  }

  toString(){
    return "Button"+this.x+","+this.y+"\nStatus "+this.status;
  }

  call(){
    this.callBack();
  }

  draw(){
    this.render.beginPath();
    this.render.font = this.font;
    this.render.lineWidth="1";
    this.render.fillStyle = this.color;
    this.render.fillRect(this.x, this.y, this.size, this.width + (this.margin * 2));
    this.render.strokeStyle = "yellow";
    this.render.strokeRect(this.x, this.y, this.size, this.width + (this.margin * 2));
    this.render.save();
    this.render.translate(this.x, this.y);
    this.render.rotate(Math.PI / 2);
    this.render.fillStyle = "white";
    this.render.textAlign = "left";
    this.render.fillText(this.text, this.margin, -(this.size / 2.5));
    this.render.restore();
  }
}//Button class

var drawComponent = Vue.component('draw-canvas', {
  template: `
    <canvas id="drawCanvas" width="200" height="100" style="border:1px solid #ffffff;">
    </canvas>
  `,
  data: function(){
    return {
      canvas: null,
      render: null,
      boxes: {},
      numInSection: 6,
      currentSelection: null,
      buttons: [],
      currentColor: "#FFFFFF",
      paintSelection: false,
      pixelData: {},
      rendered: false
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
      // console.log("touchstart:",e.touches.length);

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

      this.handleClicked("start", touchPos.x, touchPos.y);
    }.bind(this), false);

    this.canvas.addEventListener('touchmove', function(e) {
      var rect = this.canvas.getBoundingClientRect(), // abs. size of element
      scaleX = this.canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = this.canvas.height / rect.height;  // relationship bitmap vs. element for Y
      // console.log("touchmove:",e.touches.length);

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

      this.handleClicked("start", touchPos.x, touchPos.y);
    }.bind(this), false);

    //create all objects
    this.initialize();

    //draw all boxes
    this.draw();

    // TODO figure out how to disable swipe
    // this.$root._data.f7params.panel.swipe = 'false';
    // console.log(this.$root);
  },
  methods: {
    initialize: function(){

      if(this.$root.totalLeds == null){
        console.log("data Not ready");
        this.rendered = false;
        return
      }
      this.rendered = true;

      //create the boxes
      let margin = 10;
      let sectionSize = 60;
      var indexId = 0;
      let ledStartX = this.canvas.width * 0.65;
      let ledStartY = this.canvas.height * 0.55;

      let numTop = this.$root.endTop - this.$root.startTop;
      // console.log(numTop);
      let topSecionsCount = Math.ceil((numTop) / this.numInSection);
      // console.log(topSecionsCount);
      let topSize = Math.floor((this.canvas.height - (margin)) / topSecionsCount);
      for(var i=0; i<topSecionsCount; i++){
        let tempId = indexId;
        indexId++;

        //create Led sections
        let tempLeds = [];
        let numOfLeds = this.numInSection;
        if(numTop < this.numInSection) numOfLeds = numTop;
        let startOffset = (numOfLeds * sectionSize) / 2;
        for(var f=0; f<this.numInSection && numTop>0; f++){
          let tempLed = new Led(
            ((this.$root.endTop - (i*this.numInSection))-f),
            (ledStartX - (sectionSize/4)),
            (ledStartY - (sectionSize/4) + (f*sectionSize) - startOffset),
            sectionSize,
            "#000000");
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
      // console.log(numLeft);
      let leftSecionsCount = Math.ceil((numLeft) / this.numInSection);
      let leftSideSize = (this.canvas.width - (3*margin) - topSize) / leftSecionsCount;
      for(var i=0; i<leftSecionsCount; i++){
        let tempId = indexId;
        indexId++;
        //create Led sections
        let tempLeds = [];
        let numOfLeds = this.numInSection;
        if(numLeft < this.numInSection) numOfLeds = numLeft;
        let startOffset = (numOfLeds * sectionSize) / 2;
        for(var f=0; f<this.numInSection && numLeft>0; f++){
          let tempLed = new Led(
            ((this.$root.totalLeds - (i*numOfLeds))-f),
            (ledStartX - (sectionSize/4)),
            (ledStartY - (sectionSize/4) + (f*sectionSize) - startOffset),
            sectionSize,
            "#000000");
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
      // console.log(numRight);
      let rightSecionsCount = Math.ceil((numRight) / this.numInSection);
      let rightSideSize = (this.canvas.width - (3*margin) - topSize) / rightSecionsCount;
      for(var i=0; i<rightSecionsCount; i++){
        let tempId = indexId;
        indexId++;
        //create Led sections
        let tempLeds = [];
        let numOfLeds = this.numInSection;
        if(numRight < this.numInSection) numOfLeds = numRight;
        let startOffset = (numOfLeds * sectionSize) / 2;
        for(var f=0; f<this.numInSection && numRight>0; f++){
          let tempLed = new Led(
            ((i*numOfLeds)+f),
            (ledStartX - (sectionSize/4)),
            (ledStartY - (sectionSize/4) + (f*sectionSize) - startOffset),
            sectionSize,
            "#000000");
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

      //create Button to toggle "paint entire section"
      let tempColor = "#444444";
      if(!this.paintSelection) tempColor = "#000000";
      let buttonToggleSection = new Button(
        this.canvas.width * 0.1, this.canvas.height * 0.15 ,
        sectionSize, "Fill Entire Section", tempColor, this.render, ()=>{
          this.paintSelection = !this.paintSelection;
          if(!this.paintSelection){
            buttonToggleSection.color = "#000000";
          } else {
            //turn on paint entire section and remove menu
            buttonToggleSection.color = "#444444";
            if(this.currentSelection != null){
              this.currentSelection.selected = false;
              this.currentSelection = null;
            }
          }
          // console.log("Paint Section",this.paintSelection);
        });
      this.buttons.push(buttonToggleSection);

      //create button to pick color
      let colors = ["#000000","#FFFFFF","#0000FF","#FF0000",
                    "#045900","#42f1f4","#FF00FF","#eeff00"];
      let tempColorIndex = 0;
      let spacingV = 50;
      let spacingH = 65;
      for(var j=0; j<4; j++){
        for(var k=0; k<2; k++){
          console.log("in loop",colors[tempColorIndex]);

          //x, y, size, text, color, render, callBack
          let tempColorButton = new Button(
            (this.canvas.width * 0.1) + (spacingH*k),
            (this.canvas.height * 0.5) + (spacingV*j),
            sectionSize, "       ", colors[tempColorIndex], this.render, ()=>{
              console.log(tempColorButton.color);
              this.currentColor = tempColorButton.color;
            });
          this.buttons.push(tempColorButton);

          tempColorIndex++;
        }
      }


      //update current pixels at load for new cleints or refresh
      Object.entries(this.$root.pixelData).forEach((pixel)=>{
        // console.log("Pixel", pixel);
        this.colorLed(pixel[0], pixel[1]);
      });
    },
    draw: function(){
      this.render.fillStyle = "black";
      this.render.fillRect(0, 0, this.canvas.width, this.canvas.height);
      Object.entries(this.boxes).forEach((box)=>{
        // console.log(box);
        box[1].draw();
      });
      this.buttons.forEach((button)=>{
        button.draw();
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
      for(var i=0; i< this.buttons.length && tempClicked == null; i++){
        // console.log(box);
        tempClicked = this.buttons[i].clicked(x, y);
      };

      return tempClicked;
    },
    handleClicked: function(type, x, y){
      let clickedBox = this.getClicked(x, y);

      if(clickedBox){
        // console.log(clickedBox.toString());
      } else return;

      switch(clickedBox.type){
        case "Box":
          if(this.paintSelection){
            //Paint all LEDS in section
            clickedBox.leds.forEach((led)=>{
              led.changeColor(this.currentColor);
            });
          } else { // paint individual LEDS
            //if Nothing was selected
            if(this.currentSelection != null){
              this.currentSelection.selected = false;
            }
            //if you click the same section, close sub menu
            if(this.currentSelection != null && clickedBox.id == this.currentSelection.id){
              this.currentSelection = null;
              clickedBox.selected = false;
            } else {  //clicked new section
              this.currentSelection = clickedBox;
              clickedBox.selected = true;
            }
         }
          break;
        case "Led":
          // console.log("Clicked Box: ", clickedBox);
          clickedBox.changeColor(this.currentColor);
          break;
        case "Button":
          clickedBox.call();
          break;
        default:
          console.log("Error in clicked type");

      }
      // this.callBack();
      this.draw();
    },//handle Clicked
    colorLed: function(num, color){
      //get led by num
      let led = null;
      let boxes = Object.entries(this.boxes);
      for(var i=0; i< boxes.length && led == null; i++){
        for(var y=0; y< boxes[i][1].leds.length && led == null; y++){
          // console.log(boxes[i][1]);
          if(boxes[i][1].leds[y].num == num) led = boxes[i][1].leds[y];
        };
      };
      if(typeof color == "number"){
        color = this.$root.int2Hex(color);
      }
      // console.log("LED to update colorLed", led, color);
      if(led){
        led.color = color;
      }
      this.draw();

    }
  },
  created: function(){
      this.$root.$on("pixelDataChange", function(pixelData){
        console.log("child sees pixel data change:", pixelData);
        //process pixel data, update canvas
        Object.entries(pixelData).forEach((pixel)=>{
          // console.log("Pixel", pixel);
          this.colorLed(pixel[0], pixel[1]);
        });
        if(this.rendered == false) this.initialize();
      }.bind(this));
    }
});
