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
