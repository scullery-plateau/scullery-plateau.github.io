(function(){
  var defaultConfig = {
    pixelScale:6,
    pixelCount:16,
    rasterScale:2
  }
  var pixel = function(state,col,row,px,py,color,ctx) {
    var x = col*state.pixelCount + px;
    var y = row*state.pixelCount + py;
    var dim = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x*state.rasterScale,y*state.rasterScale,dim*state.rasterScale,dim*state.rasterScale);
    return `<rect x="${x*state.pixelScale}" y="${y*state.pixelScale}" width="${dim*state.pixelScale}" height="${dim*state.pixelScale}" fill="${color}" stroke="${color}"/>`;
  }
  var cell = function(state,col,row,ctx) {
    var x = col*state.pixelCount;
    var y = row*state.pixelCount;
    var dim = state.pixelCount;
    ctx.strokeStyle = "black";
    ctx.strokeRect(x*state.rasterScale,y*state.rasterScale,dim*state.rasterScale,dim*state.rasterScale);
    return `<rect x="${x*state.pixelScale}" y="${y*state.pixelScale}" width="${dim*state.pixelScale}" height="${dim*state.pixelScale}" fill="none" stroke="black" stroke-width="2"/>`;
  }
  var frame = function(state,svg) {
    return `<svg width="8in" height="10in" viewBox="0 0 ${state.width*state.pixelScale*state.pixelCount} ${state.height*state.pixelScale*state.pixelCount}">${svg}</svg>`;
  }
  var img = function(pic,index) {
    return `<a href="${pic}" download="tilesheet${index}.png"><img src="${pic}"/></a>`;
  }
  registry.apply("MapCanvas",[
  ],function(){
    return function(config){
      var state = Object.assign(defaultConfig,config);
      state.width = 0;
      state.height = 0;
      var ctx = {};
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
      this.clearUI = function(ui) {
        ui.innerHTML = "";
      }
      this.clear = function(canvasUI) {
        svg = [];
        ctx.canvas = document.createElement("canvas");
        ctx.ctx = ctx.canvas.getContext("2d");
      }
      this.dim = function(width,height) {
        ctx.canvas.width = width * state.rasterScale*state.pixelCount;
        ctx.canvas.height = height * state.rasterScale*state.pixelCount;
      }
      this.addTile = function(col,row,tile) {
        state.width = Math.max(state.width,col + 1);
        state.height = Math.max(state.height,row + 1);
        tile.forEach(function(p) {
          svg.push(pixel(state,col,row,p.x,p.y,p.color,ctx.ctx));
        });
        svg.push(cell(state,col,row,ctx.ctx));
      }
      this.drawMapSVG = function(ui) {
        ui.innerHTML += frame(state, svg.join(""));
      }
      this.paintPNG = function(ui,map) {
        map = map || "";
        ui.innerHTML += img(ctx.canvas.toDataURL(),map);
      }
    };
  });
})();
