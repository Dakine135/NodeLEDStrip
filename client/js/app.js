var socket = io();
// socket.on('connect', function(){
//   console.log("connected to Server");
// });
socket.on('event', function(data){

});
// socket.on('disconnect', function(){
//   console.log("lost Connection with Server");
// });

// socket.emit('event', "test");

// Init F7 Vue Plugin
Framework7.use(Framework7Vue);

// Init Page Components
Vue.component('page-about', {
  template: '#page-about'
});

Vue.component('speed-changer',{
  template: '#speed-changer-template',
  props:[],
  data: function(){
    return {
      speed: 100
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
new Vue({
  el: '#app',
  data: function () {
    return {
      currentState: 'off',
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



// if (window.DeviceMotionEvent == undefined) {
//     //No accelerometer is present. Use buttons.
//     alert("no accelerometer");
// } else {
//     alert("accelerometer found");
//     window.addEventListener("devicemotion", accelerometerUpdate, true);
// }
//
// function accelerometerUpdate(e) {
//    var aX = event.accelerationIncludingGravity.x*1;
//    var aY = event.accelerationIncludingGravity.y*1;
//    var aZ = event.accelerationIncludingGravity.z*1;
//    //The following two lines are just to calculate a
//    // tilt. Not really needed.
//    xPosition = Math.atan2(aY, aZ);
//    yPosition = Math.atan2(aX, aZ);
//    data = {x:xPosition, y:yPosition};
//    // alert("moveEvent: ",data);
//    socket.emit("event", data);
// }
