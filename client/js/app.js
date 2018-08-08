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

Vue.component('gyro-sensor', {
  template: '#gyro-template',
  data: function(){
    return {
      angle: null
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
        return this.$root.speed
    }
  },
  methods: {
    onSpeedChange(value){
      this.$root.speed = value;
      socket.emit('event', {settings: {speed: this.speed} });
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

// #onOff-template
Vue.component('on-off', {
  template: '#on-off-template',
  props:['title','initalStateName'],
  data: function () {
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
    turnOn: function() {
      console.log("Turning On: ", this.stateName);
      this.$root.currentState = this.stateName;
      socket.emit('event', {state: this.stateName});
    },
    turnOff: function() {
      console.log("Turning Off");
      this.$root.currentState = 'off';
      socket.emit('event', {state: 'off'});
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
  // mainApp.currentState = data.stateName;
  mainApp.speed = data.settings.speed;
  mainApp.colors = data.settings.colors;
});






var count = 0;
var data = {};

window.onload = function(){

  if (window.DeviceMotionEvent == undefined) {
      //No accelerometer is present. Use buttons.
      // alert("no accelerometer");
  } else {
      // alert("accelerometer found");
      // window.addEventListener("devicemotion", accelerometerUpdate, true);
      window.addEventListener('deviceorientation', handleOrientation);
  }


  console.log(document);
  console.log(document.querySelector('.garden'));
  var ball   = document.querySelector('.ball');
  var garden = document.querySelector('.garden');
  var output = document.querySelector('.output');

  var maxX = garden.clientWidth  - ball.clientWidth;
  var maxY = garden.clientHeight - ball.clientHeight;

  function handleOrientation(event){
    var x = event.beta;  // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]

    output.innerHTML  = "beta : " + x + "\n";
    output.innerHTML += "gamma: " + y + "\n";

    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x >  90) { x =  90};
    if (x < -90) { x = -90};

    // To make computation easier we shift the range of
    // x and y to [0,180]
    x += 90;
    y += 90;

    // 10 is half the size of the ball
    // It center the positioning point to the center of the ball
    ball.style.top  = (maxX*x/180 - 10) + "px";
    ball.style.left = (maxY*y/180 - 10) + "px";

    let roundX = Math.round( x);
    let roundY = Math.round( y);

    data = {x:roundX, y:roundY};

    // if (data.x == null || data.x == undefined){
    //      data = {x:x, y:y};
    //    } else {
    //      let avgX = (0.7 * x) + (0.3 * data.x);
    //      let avgY = (0.7 * y) + (0.3 * data.y);
    //      let roundAvgX = (Math.round( avgX * 100 )) / 100;
    //      let roundAvgY = (Math.round( avgY * 100 )) / 100;
    //      data = {x:roundAvgX, y:roundAvgY};
    //    }

       // console.log(data);
       // alert("moveEvent: ",data);
       if(count > 20){
         socket.emit("tilt", data);
         count = 0;
       } else count++;
  }
}//windows onload




//
// var count = 0;
// var data = {};
// function accelerometerUpdate(e) {
//    var aX = event.accelerationIncludingGravity.x*1;
//    var aY = event.accelerationIncludingGravity.y*1;
//    var aZ = event.accelerationIncludingGravity.z*1;
//    let dataRaw = {aX: aX, aY: aY, aZ: aZ};
//    //The following two lines are just to calculate a
//    // tilt. Not really needed.
//    xPosition = Math.atan2(aY, aZ);
//    yPosition = Math.atan2(aX, aZ);
//    if (data.x == null || data.x == undefined){
//      data = {x:xPosition, y:yPosition};
//    } else {
//      let avgX = (0.7 * xPosition) + (0.3 * data.x);
//      let avgY = (0.7 * yPosition) + (0.3 * data.y);
//      let roundAvgX = (Math.round( avgX * 100 )) / 100;
//      let roundAvgY = (Math.round( avgY * 100 )) / 100;
//      data = {x:roundAvgX, y:roundAvgY};
//    }
//
//    // console.log(data);
//    // alert("moveEvent: ",data);
//    if(count > 50){
//      socket.emit("tilt", data);
//      socket.emit("tilt", dataRaw);
//      count = 0;
//    } else count++;
// }
