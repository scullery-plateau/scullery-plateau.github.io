(function(){
  var defaultConfig = {
    pixelScale:6,
    pixelCount:16,
    rasterScale:5
  }
  var pixel = function(state,col,row,px,py,color) {
    return `<rect x="${col*state.pixelScale*state.pixelCount + px*state.pixelScale}" y="${row*state.pixelScale*state.pixelCount + py*state.pixelScale}" width="${state.pixelScale}" height="${state.pixelScale}" fill="${color}" stroke="${color}"/>`;
  }
  var cell = function(state,col,row) {
    return `<rect x="${col*state.pixelScale*state.pixelCount}" y="${row*state.pixelScale*state.pixelCount}" width="${state.pixelScale*state.pixelCount}" height="${state.pixelScale*state.pixelCount}" fill="none" stroke="black" stroke-width="2"/>`;
  }
  var frame = function(width,height,svg) {
    return `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">${svg}</svg>`;
  }
  registry.apply("MapCanvas",[
  ],function(){
    return function(config){
      var state = Object.assign(defaultConfig,config);
      console.log(state);
      state.width = 0;
      state.height = 0;
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
      this.addTile = function(col,row,tile) {
        state.width = Math.max(state.width,col + 1);
        state.height = Math.max(state.height,row + 1);
        tile.forEach(function(p) {
          svg.push(pixel(state,col,row,p.x,p.y,p.color));
        });
        svg.push(cell(state,col,row));
      }
      this.drawMapSVG = function(ui) {
        var width = state.width*state.pixelScale*state.pixelCount;
        var height = state.height*state.pixelScale*state.pixelCount;
        ui.innerHTML = frame(width, height, svg.join(""));
      }
      this.paintPNG = function(ui) {

      }
    };
  });
})();
