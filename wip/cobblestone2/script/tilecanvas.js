(function(){
  var defaultConfig = {
    tileScale:10,
    pixelCount:16
  }
  var pixel = function(state,x,y,color) {
    return `<rect x="${x*state.tileScale}" y="${y*state.tileScale}" width="${state.tileScale}" height="${state.tileScale}" fill="${color}" stroke="none"/>`;
  }
  var cell = function(state,x,y) {
    return `<rect x="${x*state.tileScale}" y="${y*state.tileScale}" width="${state.tileScale}" height="${state.tileScale}" fill="none" stroke="black" stroke-width="1"/>`;
  }
  var grid = function(state) {
    var indicies = "?".repeat(state.pixelCount).split("").map(function(c,i){return i;});
    return indicies.reduce(function(outList,x) {
      return indicies.reduce(function(out,y) {
        out.push(cell(state,x,y));
        return out;
      },outList);
    },[]);
  }
  var frame = function(width,height,svg) {
    return `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">${svg}</svg>`;
  }
  registry.apply("TileCanvas",[
  ],function(){
    return function(config){
      var state = Object.assign(defaultConfig,config);
      console.log(state);
      state.grid = grid(state);
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
        svg.push(pixel(state,x,y,color));
      }
      this.drawTileSVG = function(ui) {
        var dim = state.tileScale * state.pixelCount;
        var list = [].concat(svg,state.grid).join("");
        ui.innerHTML = frame(dim, dim, list);
      }
    };
  });
})();
