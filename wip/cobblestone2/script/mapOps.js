(function(){
  registry.apply("MapOperations",[
    "TileOperations"
  ],function(TileOperations){
    return function(map,tiles,palettes,mapCanvas,printerUI,canvasUI){
      this.drawMap = function() {
        var renderState = {};
        var charMap = {};
        var render = TileOperations.buildCharTileRenderer(map.chars,tiles,palettes,function(char) {
          console.log("init render");
          renderState.selectedChar = char;
          renderState.pixels = [];
        },function(x,y,color) {
          renderState.pixels.push({x:x,y:y,color:color});
        },function() {
          console.log("for tile");
          console.log(renderState);
          charMap[renderState.selectedChar] = renderState.pixels;
        });
        Object.keys(map.chars).forEach(render);
        console.log(charMap);
        mapCanvas.clear()
        map.map.forEach(function(row, rowIndex) {
          row.forEach(function(cell, colIndex) {
            if (charMap[cell]) {
              mapCanvas.addTile(colIndex, rowIndex, charMap[cell]);
            }
          });
        });
        mapCanvas.drawMapSVG(printerUI);
      }
    }
  })
})();
