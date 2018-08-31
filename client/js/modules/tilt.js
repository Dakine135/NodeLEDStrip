Vue.component('gyro-sensor', {
  template: '#gyro-template',
  mounted() {
    if (window.DeviceMotionEvent != undefined) {
      window.addEventListener('deviceorientation', this.handleOrientation);
    }
  },
  data: function(){
    return {
      angle: null,
      count: 0,
      data: {},
      red: 100,
      green: 100,
      blue: 100
    }
  },
  computed: {
    color: function(){
      let hexColor = "#" + componentToHex(this.red) +
                           componentToHex(this.green) +
                           componentToHex(this.blue);
      // console.log("hexColor", hexColor);
      return hexColor;
    }
  },
  methods: {
    handleOrientation(event){
      var ball   = document.querySelector('.ball');
      var garden = document.querySelector('.garden');
      var output = document.querySelector('.output');

      var maxX = garden.clientWidth  - ball.clientWidth;
      var maxY = garden.clientHeight - ball.clientHeight;

      var x = event.beta;  // In degree in the range [-180,180]
      var y = event.gamma; // In degree in the range [-90,90]
      // Because we don't want to have the device upside down
      // We constrain the x value to the range [-90,90]
      if (x >  90) { x =  90};
      if (x < -90) { x = -90};
      // To make computation easier we shift the range of
      // x and y to [0,180]
      x += 90;
      y += 90;
      let roundX = Math.round( x);
      let roundY = Math.round( y);
      let data = {x:roundX, y:roundY, color: this.color};

      //Currently only using y and not x
      //    this.data.x != data.x ||
      if(this.data.y != data.y){
        socket.emit("tilt", data);
        this.data = data;
      }

      output.innerHTML  = "beta : " + x + "\n";
      output.innerHTML += "gamma: " + y + "\n";

      // 10 is half the size of the ball
      // It center the positioning point to the center of the ball
      ball.style.top  = (maxX*x/180 - 10) + "px";
      ball.style.left = (maxY*y/180 - 10) + "px";

    },
    onRedChange(value){
      // console.log("Red change: ",value);
      this.red = value;
    },
    onGreenChange(value){
      // console.log("Green change: ",value);
      this.green = value;
    },
    onBlueChange(value){
      this.blue = value;
      // console.log("Blue change: ",this.blue);
    }
  }
});
