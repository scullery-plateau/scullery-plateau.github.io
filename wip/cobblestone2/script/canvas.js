(function(){
  var defaultConfig = {
    tileScale:10,
    pixelScale:6,
    pixelCount:16,
    rasterScale:5
  }
  registry.apply("Canvas",[
  ],function(){
    return function(config){
      var state = Object.assign(defaultConfig,config);
      var svg = [];
      this.setTileScale = function(scale) {
        state.tileScale = scale;
      }
      this.setPixelScale = function(scale) {
        state.pixelScale = scale;
      }
      this.setRasterScale = function(scale) {
        state.rasterScale = scale;
      }
      this.setPixelCount = function(scale) {
        state.pixelCount = scale;
      }
      this.clear = function() {
        svg = [];
      }
      this.addPixel = function(x,y,color) {
        svg.push(`<rect x="${x*state.tileScale}" y="" width="${state.tileScale}" height="${state.tileScale}" fill="${color}" stroke="black" stroke-width="1"/>`);
      }
      this.addTile = function(x,y,palette) {

      }
      this.drawSVG = function() {

      }
      this.paintPNG = function() {

      }
    };
  });
})();
