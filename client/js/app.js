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
socket.on('connect', function(){
  console.log("connected to Server");
});
socket.on('event', function(data){

});
socket.on('disconnect', function(){
  console.log("lost Connection with Server");
});
