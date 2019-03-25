(function(){
  registry.apply("TileMap",[
    "Selector",
    "TileOperations"
  ],function(Selector,TileOperations){
    return function(mapCanvas,tileCanvas,tiles,palettes,map,ui){
      var charTileRenderer = function(init,forEachPixel,forTile) {
        return function(char) {
          if(map.chars[char]) {
            var charObj = map.chars[char];
            if (tiles[charObj.tile]) {
              if (palettes[charObj.palette]) {
                var tile = tiles[charObj.tile];
                var palette = palettes[charObj.palette];
                init(char);
                TileOperations.applyPaletteToTile(palette,tile,TileOperations.applyTransforms(function(pixel) {
                  forEachPixel(pixel.x,pixel.y,pixel.color);
                },charObj.transforms));
                forTile();
              }
            }
          }
        }
      }
      var drawMap = function() {
        var renderState = {charMap:{}};
        var render = charTileRenderer(function(char) {
          renderState.selectedChar = char;
          renderState.pixels = [];
        },function(x,y,color) {
          renderState.pixels.push({x:x,y:y,color:color});
        },function() {
          renderState.charMap[renderState.selectedChar] = renderState.pixels;
        });
        Object.keys(map.chars).forEach(render);
        
      }
      var drawTile = function() {
        var render = charTileRenderer(tileCanvas.clear,tileCanvas.addPixel,function() {
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
        drawMap();
      }
      this.updateAndDrawMap = function() {
        TileOperations.update(Object.keys(map.chars),ui.mapInput,function(allChars,newChars) {
          map.map = allChars;
          newChars.forEach(function(char){
            map.chars[char] = {transforms:{}};
          });
          Selector.loadSelector(ui.charSelector,Object.keys(map.chars),"Choose the map character to which to apply a tile and palette.",charOption);
        });
        drawMap();
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
