(function(){
  registry.apply("TileMap",[
    "Selector",
    "TileOperations"
  ],function(Selector,TileOperations){
    return function(canvas,tiles,palettes,map,ui){
      var drawMap = function() {

      }
      var drawTile = function() {

      }
      this.updateAndDrawMap = function() {
        TileOperations.update(Object.keys(map.chars)),ui.mapInput,function(allChars,newChars) {
          map.map = allChars;
          newChars.forEach(function(char){
            map.chars[char] = {transforms:{}};
          })
        });
        drawMap();
      }
      this.selectAndDrawChar = function() {
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
      this.selectTileForChar = function() {
        var char = Selector.selectedValue(ui.charSelector);
        if(map.chars[char]) {
          var tile = Selector.selectedValue(ui.tileForMapSelector);
          map.chars[char].tile = tile;
          drawTile();
          drawMap();
        }
      }
      this.selectPaletteForChar = function() {
        var char = Selector.selectedValue(ui.charSelector);
        if(map.chars[char]) {
          var palette = Selector.selectedValue(ui.paletteForMapSelector);
          map.chars[char].palette = palette;
          drawTile();
          drawMap();
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
          drawMap();
        }
      }
    };
  });
})();
