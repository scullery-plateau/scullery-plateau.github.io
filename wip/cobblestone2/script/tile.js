(function(){
  var lineItem = function(instanceName,char,color,index) {
    if (color) {
      return `<li>"${char}": ${color} <span style="background-color:${color};color:${color};">______</span> <button onclick="${instanceName}.swapNextTileChar(${index})">+</button><button onclick="${instanceName}.swapPrevTileChar(${index})">-</button></li>`;
    } else {
      return `<li>"${char}": Transparent <button onclick="${instanceName}.swapNextTileChar(${index})">+</button><button onclick="${instanceName}.swapPrevTileChar(${index})">-</button></li>`;
    }
  }
  var tileOption = function(option,tileName) {
    option.text = tileName;
    option.value = tileName;
  }
  registry.apply("Tile",[
    "Selector",
    "TileOperations"
  ],function(Selector,TileOperations){
    return function(instanceName,canvas,tiles,palettes,ui){
      var drawTile = function(update) {
        var tileName = Selector.selectedValue(ui.tileSelector);
        var paletteName = Selector.selectedValue(ui.tilePaletteSelector);
        if (tiles[tileName]) {
          if (palettes[paletteName]) {
            var tile = tiles[tileName];
            var palette = palettes[paletteName];
            var size = Math.min(tile.index.length,palette.length);
            var listing = [];
            for (var i = 0; i < size; i++) {
              listing.push(lineItem(instanceName,tile.index[i],palette[i],i));
            }
            ui.tileCharIndex.innerHTML = listing.join("");
            canvas.clear();
            TileOperations.applyPaletteToTile(palette,tile,function(pixel) {
              canvas.addPixel(pixel.x,pixel.y,pixel.color);
            });
            canvas.drawTileSVG(ui.tileDisplay);
          }
        }
      }
      this.reloadView = function() {
        Selector.loadSelector(ui.tileSelector,Object.keys(tiles),"Choose a tile:",tileOption);
        Selector.selectLast(ui.tileSelector);
        Selector.loadSelector(ui.tileForMapSelector,Object.keys(tiles),"Choose a tile:",tileOption);
        Selector.selectLast(ui.tilePaletteSelector);
        var tile = tiles[Selector.selectedValue(ui.tileSelector)];
        ui.tilePixelInput.value = tile.pixels.map(function(row) {
          return row.join("");
        }).join("\r\n")
        drawTile();
      }
      this.addTile = function() {
        var tileName = prompt("What do you want to name this tile?");
        if (tiles[tileName]) {
          alert("There is already a tile named '" + tileName + "'.");
        } else {
          tiles[tileName] = {
            pixels:[],
            index:[]
          };
          Selector.loadSelector(ui.tileSelector,Object.keys(tiles),"Choose a tile:",tileOption);
          Selector.selectLast(ui.tileSelector);
          Selector.loadSelector(ui.tileForMapSelector,Object.keys(tiles),"Choose a tile:",tileOption);
        }
      }
      var swap = function(i,j) {
        var tile = Selector.selectedValue(ui.tileSelector);
        if (tiles[tile]) {
          var arr = tiles[tile].index;
          if (j < 0) {
            j = arr.length - 1;
          }
          if (j >= arr.length) {
            j = 0;
          }
          var temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          console.log()
          drawTile();
        }
      }
      this.swapPrevTileChar = function(index) {
        swap(index,index-1);
      }
      this.swapNextTileChar = function(index) {
        swap(index,index+1);
      }
      this.drawTile = drawTile;
      this.updateAndDrawTile = function() {
        if (tiles[tileName]) {
          var tile = tiles[tileName];
          TileOperations.update(tile.index,ui.tilePixelInput.value,function(allChars,newChars) {
            tile.pixels = allChars;
            tile.index = tile.index.concat(newChars);
          });
          drawTile();
        }
      }
    };
  });
})();
