Vue.component('draw-canvas', {
  template: `
    <canvas id="drawCanvas" width="200" height="100" style="border:1px solid #000000;">
    </canvas>
  `,
  data: function(){
    return {
      canvas: null,
      render: null
    }
  },
  mounted(){
    this.canvas = document.getElementById("drawCanvas");
    this.render=this.canvas.getContext("2d");

    this.canvas.width = screen.width;
    this.canvas.height = screen.height * 0.8;
    // console.log(this.canvas);

    //create the boxes
    let margin = 5;
    let numLeft = this.$root.totalLeds - this.$root.endTop;
    let sideWidthLeft = (this.canvas.width - (2*margin)) / numLeft;
    let numRight = this.$root.startTop;
    let sideWidthRight = (this.canvas.width - (2*margin)) / numRight;
    let numTop = this.$root.endTop - this.$root.startTop;
    let topWidth = (this.canvas.height - (4*margin) - sideWidthLeft - sideWidthRight) / numTop;
    // console.log(numLeft, numRight, numTop);


    this.render.lineWidth="1";
    this.render.strokeStyle="green";
    for(var i=0; i<numLeft; i++){
      this.render.beginPath();
      this.render.rect((margin+(i*sideWidthLeft)),
        margin,
        sideWidthLeft,
        (sideWidthLeft*4)
      );
      this.render.stroke();
    }
    for(var i=0; i<numRight; i++){
      this.render.beginPath();
      this.render.rect(
        (margin+(i*sideWidthRight)),
        (this.canvas.height - margin - (sideWidthRight*4)),
        sideWidthRight,
        (sideWidthRight*4)
      );
      this.render.stroke();
    }
    for(var i=0; i<numTop; i++){
      this.render.beginPath();
      this.render.rect(
        (margin+(i*sideWidthRight)),
        (this.canvas.height - margin - (sideWidthRight*4)),
        sideWidthRight,
        (sideWidthRight*4)
      );
      this.render.stroke();
    }

    // TODO figure out how to disable swipe
    // this.$root._data.f7params.panel.swipe = 'false';
    // console.log(this.$root);
  },
  methods: {

  }
});
