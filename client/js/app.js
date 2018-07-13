// Init F7 Vue Plugin
Framework7.use(Framework7Vue);

// Init Page Components
Vue.component('page-about', {
  template: '#page-about'
});

// Init App
new Vue({
  el: '#app',
  data: function () {
    return {
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


var socket = io();
// socket.on('connect', function(){
//   console.log("connected to Server");
// });
socket.on('event', function(data){

});
// socket.on('disconnect', function(){
//   console.log("lost Connection with Server");
// });

socket.emit('event', "test");


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
