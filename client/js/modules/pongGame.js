Vue.component('pong-game', {
  template: '#pong-template',
  data: function(){
    return {
      canvas: null,
      render: null
    }
  },
  mounted(){
    this.canvas = document.getElementById("pongCanvas");
    this.render=this.canvas.getContext("2d");

    this.canvas.width = screen.width;
    this.canvas.height = screen.height * 0.80;

    // Create gradient
    console.log(this.canvas);
    var grd = this.render.createRadialGradient(
      180,
      256, 50,
      360,
      512, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    this.render.fillStyle = grd;
    this.render.fillRect(10, 10, 150, 80);
  },
  methods: {

  }
});
