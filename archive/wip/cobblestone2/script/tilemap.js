(function(){
  registry.apply("TileMap",[
    "MapOperations",
    "Selector",
    "TileOperations"
  ],function(MapOperations,Selector,TileOperations) {
    return function(mapCanvas,tileCanvas,tiles,palettes,map,ui) {
      var mapOps = new MapOperations(map,tiles,palettes,mapCanvas,ui.printerOut,ui.mapDisplay);
      var drawTile = function() {
        var render = TileOperations.buildCharTileRenderer(map.chars,tiles,palettes,tileCanvas.clear,tileCanvas.addPixel,function() {
          tileCanvas.drawTileSVG(ui.charTileDisplay);
        })
        var char = Selector.selectedValue(ui.charSelector);
        render(char);
      }
      var charOption = function(option,char) {
        option.text = '"' + char + '"';
        option.value = char;
      }
      var selectChar = function() {
        var char = Selector.selectedValue(ui.charSelector);
        if(map.chars[char]) {
          Selector.setSelectedValue(ui.tileForMapSelector,map.chars[char].tile);
          Selector.setSelectedValue(ui.paletteForMapSelector,map.chars[char].palette);
          TileOperations.getTransformNames().forEach(function(transformName) {
            document.getElementById(transformName).checked = (map.chars[char].transforms[transformName])?true:false;
          });
          drawTile();
        }
      }
      this.reloadView = function() {
        ui.mapInput.value = map.map.map(function(r){
          return r.join("");
        }).join("\r\n");
        Selector.loadSelector(ui.charSelector,Object.keys(map.chars),"Choose the map character to which to apply a tile and palette.",charOption);
        Selector.selectLast(ui.charSelector);
        selectChar();
        mapOps.drawMap();
      }
      this.updateAndDrawMap = function() {
        TileOperations.update(Object.keys(map.chars),ui.mapInput,function(allChars,newChars) {
          map.map = allChars;
          newChars.forEach(function(char){
            map.chars[char] = {transforms:{}};
          });
          Selector.loadSelector(ui.charSelector,Object.keys(map.chars),"Choose the map character to which to apply a tile and palette.",charOption);
        });
        mapOps.drawMap();
      }
      this.selectAndDrawChar = function() {
        selectChar();
      }
      this.selectTileForChar = function() {
        var char = Selector.selectedValue(ui.charSelector);
        if(map.chars[char]) {
          var tile = Selector.selectedValue(ui.tileForMapSelector);
          map.chars[char].tile = tile;
          drawTile();
          mapOps.drawMap();
        }
      }
      this.selectPaletteForChar = function() {
        var char = Selector.selectedValue(ui.charSelector);
        if(map.chars[char]) {
          var palette = Selector.selectedValue(ui.paletteForMapSelector);
          map.chars[char].palette = palette;
          drawTile();
          mapOps.drawMap();
        }
      }
      this.applyTransform = function(selected,transform) {
        var char = Selector.selectedValue(ui.charSelector);
        if(map.chars[char]) {
          if(selected) {
            map.chars[char].transforms[transform] = true;
          } else {
            delete map.chars[char].transforms[transform];
          }
          drawTile();
          mapOps.drawMap();
        }
      }
    };
  });
})();
