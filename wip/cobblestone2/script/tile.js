(function(){
  var lineItem = function(instanceName,char,color,index) {
    if (color) {
      return `<li style="display:inline;">"${char}": ${color}<button onclick="${instanceName}.swapNextTileChar(${index})">+</button><button onclick="${instanceName}.swapPrevTileChar(${index})">-</button><span style="color:${color};background-color:${color};display:block;">_</span></li>`;
    } else {
      return `<li style="display:inline;">"${char}": Transparent<button onclick="${instanceName}.swapNextTileChar(${index})">+</button><button onclick="${instanceName}.swapPrevTileChar(${index})">-</button><span style="display:block;">_</span></li>`;
    }
  }
  registry.apply("Tile",[
    "Selector"
  ],function(Selector){
    return function(instanceName,svg,tiles,palettes,ui){
      var drawTile = function(rows) {
        var tileName = Selector.selectedValue(ui.tileSelector);
        var paletteName = Selector.selectedValue(ui.tilePaletteSelector);
        if (tiles[tileName]) {
          if (palettes[paletteName]) {
            var tile = tiles[tileName];
            if (rows) {
              var chars = rows.join("");
              var newChars = tile.index.reduce(function(char){
                return myChars.split(char).join("");
              },chars);
              newChars.split("").forEach(function(char) {
                tile.index.push(char);
              })
              tile.pixels = rows.map(function(row) {
                return row.join("");
              });
            }
            var palette = palettes[paletteName];
            var size = Math.min(tile.index.length,palette.length);
            var listing = [];
            var mapping = {};
            for (var i = 0; i < size; i++) {
              listing.push(lineItem(instanceName,tile.index[i],palette[i],i));
              mapping[tile.index[i]] = palette[i];
            }
            ui.tileCharIndex.innerHTML = listing.join("");
            var pixels = [];
            tile.pixels.forEach(function(row,y) {
              row.forEach(function(char,x) {
                var color = mapping[char];
                if (color) {
                  pixels.push({
                    x:x,
                    y:y,
                    color:color
                  });
                }
              })
            })
            ui.tileDisplay = svg.draw(pixels);
          }
        }
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
          Selector.loadSelector(ui.tileSelector,Object.keys(tiles),"Choose a tile:");
          Selector.selectLast(ui.tileSelector);
          Selector.loadSelector(ui.tileForMapSelector,Object.keys(tiles),"Choose a tile:");
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
        drawTile(ui.tilePixelInput.value.split("\r").join("").split("\n");
      }
    };
  });
})();
