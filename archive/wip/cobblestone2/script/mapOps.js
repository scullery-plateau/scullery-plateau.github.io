(function(){
  registry.apply("MapOperations",[
    "TileOperations"
  ],function(TileOperations){
    return function(map,tiles,palettes,mapCanvas,printerUI,galleryUI,canvasUI){
      this.drawMap = function() {
        var renderState = {};
        var charMap = {};
        var render = TileOperations.buildCharTileRenderer(map.chars,tiles,palettes,function(char) {
          renderState.selectedChar = char;
          renderState.pixels = [];
        },function(x,y,color) {
          renderState.pixels.push({x:x,y:y,color:color});
        },function() {
          charMap[renderState.selectedChar] = renderState.pixels;
        });
        Object.keys(map.chars).forEach(render);
        mapCanvas.clearUI(printerUI);
        mapCanvas.clearUI(galleryUI);
        mapCanvas.clearUI(canvasUI);
        map.maps.forEach(function(map, mapIndex) {
          mapCanvas.clear(canvasUI);
          mapCanvas.dim(map.map(function(row) {
            return row.length;
          }).reduce(function(max,i){
            return Math.max(max,i);
          },0),map.length);
          map.forEach(function(row, rowIndex) {
            row.forEach(function(cell, colIndex) {
              if (charMap[cell]) {
                mapCanvas.addTile(colIndex, rowIndex, charMap[cell]);
              }
            });
          });
          mapCanvas.drawMapSVG(printerUI);
          mapCanvas.paintPNG(galleryUI,mapIndex);
        });
      }
    }
  });
})();
