(function(){
  registry.apply("Canvas",[
  ],function(){
    return function(){
      var state = {};
      this.setScale = function(scale) {
        state.scale = scale;
      }
      this.clear = function() {

      }
      this.drawPixel = function(x,y,color) {

      }
      this.paintSVG = function() {

      }
      this.paintPNG = function() {

      }
    };
  });
})();
