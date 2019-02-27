(function(){
  window[registryName].apply('PixelPainter',['Point'],function(Point) {
    return function(initScale) {
      
      var ui = {};
      
      var state = {scale:initScale};
      
      this.setCanvas = function(canvas) {
        ui.canvas = canvas;
        ui.ctx = canvas.getContext("2d");
      }
      
      this.setScale = function(scale) {
        state.scale = scale;
      }
      
      this.getData = function() {
        return Object.entries(state).reduce(function(out, entry) {
          out[entry[0]] = entry[1];
          return out;
        },{});
      }
      
      this.paint = function(width, height, pixels) {
        var w =  width * state.scale;
        var h =  height * state.scale;
        ui.canvas.width = w;
        ui.canvas.height = h;
        ui.ctx.clearRect(0, 0, w, h);
        pixels.entries().forEach(function(entry){
          var point = Point.parse(entry[0]);
          ui.ctx.fillStyle = entry[1];
          ui.ctx.fillRect(state.scale * point.getX(), state.scale * point.getY(), state.scale, state.scale);
        });
        return ui.canvas.toDataURL();
      }
    }
  });
})()