(function(){
  registry.apply("TileBuilder",[
  ],function(){
    var TileBuilder = function(paletteId,charindexId,pixelsId,canvasId) {
      var ui = {};
      this.init = function() {
        ui.palette = document.getElementById(paletteId);
        ui.charindex = document.getElementById(charindexId);
        ui.pixels = document.getElementById(pixelsId);
        ui.canvas = document.getElementById(canvasId);
      };
      this.buildtile = function() {
        var palette = ui.palette.value.split(",").map(function(color) {
          return color.trim();
        });
        var charIndex = ui.charindex.value;
        var pixels = 
      };
    }
    return Builder;
  });
})();
