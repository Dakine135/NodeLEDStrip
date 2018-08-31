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
