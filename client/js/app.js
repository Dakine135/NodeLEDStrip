var socket = io();

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
      pixelData: [],
      // Framework7 parameters here
      f7params: {
        root: '#app', // App root element
        id: 'io.framework7.LedArchApp', // App bundle ID
        name: 'DustinLedArch', // App name
        theme: 'auto', // Automatic theme detection
        // panel: {
        //   swipe: 'left'
        // },
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
  methods: {
    int2Hex: function(int){
      console.log(int);
       var b = (int & 0xFF).toString(16);
       var g = ((int >> 8) & 0xFF).toString(16);
       var r = ((int >> 16) & 0xFF).toString(16);
       if(int <= 65535) r = 0;
       if(int <= 255) g = 0;

       r = ('0' + r).slice(-2);
       g = ('0' + g).slice(-2);
       b = ('0' + b).slice(-2);

       return "#" + r + g + b;
    }
  },
  watch: {
    pixelData: {
      handler: function(val, oldVal){
        console.log("parent watcher");
        this.$emit("pixelDataChange", this.pixelData);
      }
    }
  }
}); // end vue app

socket.emit('event', {state: 'draw'});

socket.on('clientUpdate', function(data){
  // console.log("clientUpdate: ", data);
  if(data.stateName) mainApp.currentState = data.stateName;
  if(data.settings && data.settings.speed) mainApp.speed = data.settings.speed;
  if(data.settings  && data.settings.colors) mainApp.colors = data.settings.colors;
  if(data.totalLeds) mainApp.totalLeds = data.totalLeds;
  if(data.startTop) mainApp.startTop = data.startTop;
  if(data.endTop) mainApp.endTop = data.endTop;
  if(data.pixelData) mainApp.pixelData = data.pixelData;
  // console.log("test: ", mainApp.pixelData);
});
