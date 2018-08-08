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
        console.log("computed speed from root");
        return this.$root.speed
    }
  },
  methods: {
    onSpeedChanged(value){
      console.log("Speed change method");
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
  mainApp.currentState = data.stateName;
  mainApp.speed = data.settings.speed;
  mainApp.colors = data.settings.colors;
});



// if (window.DeviceMotionEvent == undefined) {
//     //No accelerometer is present. Use buttons.
//     // alert("no accelerometer");
// } else {
//     // alert("accelerometer found");
//     window.addEventListener("devicemotion", accelerometerUpdate, true);
// }
//
// var count = 0;
// function accelerometerUpdate(e) {
//    var aX = event.accelerationIncludingGravity.x*1;
//    var aY = event.accelerationIncludingGravity.y*1;
//    var aZ = event.accelerationIncludingGravity.z*1;
//    //The following two lines are just to calculate a
//    // tilt. Not really needed.
//    xPosition = Math.atan2(aY, aZ);
//    yPosition = Math.atan2(aX, aZ);
//    data = {x:xPosition, y:yPosition};
//    // console.log(data);
//    // alert("moveEvent: ",data);
//    if(count > 100){
//      socket.emit("tilt", data);
//      count = 0;
//    } else count++;
// }
