var socket = io();
// socket.on('connect', function(){
//   console.log("connected to Server");
// });

// socket.on('disconnect', function(){
//   console.log("lost Connection with Server");
// });

// socket.emit('event', "test");

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// Init F7 Vue Plugin
Framework7.use(Framework7Vue);

// Init Page Components
Vue.component('page-about', {
  template: '#page-about'
});

Vue.component('send-pulse', {
  template: '#pulse-template',
  data: function(){
    return {
      red: 100,
      green: 100,
      blue: 100,
      speed: 100,
      minSpeed: 0.01,
      maxSpeed: 200
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
    },
    onSpeedChanged(value){
      // console.log("Speed change method");
      this.speed = value;
    },
    sendPulse: function(){
      console.log("Send Pulse");
      socket.emit('event', {pulse: {color: this.color, speed: this.speed}});
    }
  }
});

Vue.component('gyro-sensor', {
  template: '#gyro-template',
  mounted() {
    if (window.DeviceMotionEvent == undefined) {
        //No accelerometer is present. Use buttons.
        // alert("no accelerometer");
    } else {
        // alert("accelerometer found");
        // window.addEventListener("devicemotion", accelerometerUpdate, true);
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

Vue.component('speed-changer',{
  template: '#speed-changer-template',
  props:[],
  data: function() {
    return {
      minSpeed: 0.01,
      maxSpeed: 200
    }
  },
  computed: {
    speed: function(){
        // console.log("computed speed from root");
        return this.$root.speed
    }
  },
  methods: {
    onSpeedChanged(value){
      // console.log("Speed change method");
      // this.$root.speed = value;
      socket.emit('event', {settings: {speed: value} });
    },
    addSpeed(value){
      let newSpeed = Math.round((this.$root.speed + value) * 100) / 100;

      socket.emit('event', {settings: {speed: newSpeed} });
    }
  }
});

Vue.component('color-picker',{
  template: '#color-picker-template',
  props:[],
  data: function() {
    return {
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
    },
    colorsRows: function(){
      var tempReturn = [];
      var tempRow = [];
      for(var i=0; i<this.$root.colors.length; i++){
        if(tempRow.length == 2){
          tempReturn.push(tempRow);
           tempRow = [];
         } else tempRow.push(this.$root.colors[i]);
      }
      if(tempRow.length > 0) tempReturn.push(tempRow);
      // console.log("colorsRows", tempReturn);
      return tempReturn;
    }
  },
  methods: {
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
    },
    addColor(){
      console.log("AddColor:", this.color);
      socket.emit('event', {settings: {addColor: this.color} });
    },
    removeColor(color){
      console.log("RemoveColor:", color);
      socket.emit('event', {settings: {removeColor: color} });
    }
  }
});

Vue.component('mode-switch',{
  template: '#mode-switch-template',
  props:['title','initalStateName'],
  data: function(){
    return {
      stateName: this.initalStateName
    }
  },
  computed: {
    isActive: function(){
      if(this.stateName === this.$root.currentState) return true;
      return false;
    }
  },
  methods: {
    toggle: function() {
      console.log("Toggle: ", this.stateName);
      this.$root.currentState = this.stateName;
      socket.emit('event', {state: this.stateName});
    }
  }
});

// Init App
var mainApp = new Vue({
  el: '#app',
  data: function () {
    return {
      currentState: 'off',
      speed: 10,
      colors: [],
      // Framework7 parameters here
      f7params: {
        root: '#app', // App root element
        id: 'io.framework7.LedArchApp', // App bundle ID
        name: 'DustinLedArch', // App name
        theme: 'auto', // Automatic theme detection
        panel: {
          swipe: 'left'
        },
        // App routes
        routes: [
          {
            path: '/about/',
            component: 'page-about'
          }
        ],
      }
    }
  },
}); // end vue app

socket.on('clientUpdate', function(data){
  console.log("clientUpdate: ", data);
  mainApp.currentState = data.stateName;
  mainApp.speed = data.settings.speed;
  mainApp.colors = data.settings.colors;
});
