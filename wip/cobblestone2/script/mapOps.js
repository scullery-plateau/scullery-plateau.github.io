(function(){
  registry.apply("MapOperations",[
    "TileOperations"
  ],function(TileOperations){
    return function(map,tiles,palettes,mapCanvas,printerUI,canvasUI){
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
        mapCanvas.clear()
        map.map.forEach(function(row, rowIndex) {
          row.forEach(function(cell, colIndex) {
            mapCanvas.addTile(colIndex, rowIndex, charMap[cell]);
          });
        });
        mapCanvas.drawMapSVG(printerUI);
      }
    }
  })
})();
