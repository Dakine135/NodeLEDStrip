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
