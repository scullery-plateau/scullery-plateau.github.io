(function(){
  var defaultConfig = {
    pixelScale:6,
    pixelCount:16,
    rasterScale:5
  }
  var pixel = function(state,col,row,px,py,color) {
    return `<rect x="${col*state.pixelScale*state.pixelCount + x*state.pixelScale}" y="${row*state.pixelScale*state.pixelCount + y*state.pixelScale}" width="${state.pixelScale}" height="${state.pixelScale}" fill="${color}" stroke="none"/>`;
  }
  var cell = function(state,col,row) {
    return `<rect x="${col*state.pixelScale*state.pixelCount}" y="${y*state.pixelScale*state.pixelCount}" width="${state.pixelScale*state.pixelCount}" height="${state.pixelScale*state.pixelCount}" fill="none" stroke="black" stroke-width="2"/>`;
  }
  var frame = function(width,height,svg) {
    return `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">${svg}</svg>`;
  }
  registry.apply("SimpleForm",[
    "FileParser","MapCanvas","MapOperations","TileOperations"
  ],function(FileParser,MapCanvas,MapOperations,TileOperations){
    return function(fileLoadInputId,canvasId,galleryId,printOutId){
      var parser = new FileParser();
      this.loadFile = function() {
        var ui = {
          printer:document.getElementById(printOutId),
          canvas:document.getElementById(canvasId),
          gallery:document.getElementById(galleryId),
          fileLoadInput:document.getElementById(fileLoadInputId)
        }
        loadFile(ui.fileLoadInput,function(fileData) {
          var data = parser.parseMapFile(fileData);
          var mapCanvas = new MapCanvas();
          var mapOps = new MapOperations(data.map,data.tiles,data.palettes,mapCanvas,ui.printer,ui.gallery,ui.canvas);
          mapOps.drawMap();
          alert("complete and ready to print.");
        })
      }
    };
  });
})();
