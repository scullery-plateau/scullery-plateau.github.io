(function(){
  registry.apply("TileOperations",[
  ],function(){
    return {
      updateTile:function(tile,text) {
        var rows = text.split("\r").join("").split("\n");
        var chars = rows.join("");
        var newChars = tile.index.reduce(function(myChars,char){
          return myChars.split(char).join("");
        },chars);
        while (newChars.length > 0) {
          var next = newChars[0];
          tile.index.push(next);
          newChars = newChars.split(next).join("");
        }
        newChars.split("").forEach(function(char) {
          tile.index.push(char);
        })
        tile.pixels = rows.map(function(row) {
          return row.split("");
        });
      },
      applyPaletteToTile:function(palette,tile,forEach) {
        var size = Math.min(palette.length,tile.index.length);
        var mapping = {};
        for (var i = 0; i < size; i++) {
          mapping[tile.index[i]] = palette[i];
        }
        tile.pixels.forEach(function(row,y) {
          row.forEach(function(char,x) {
            var color = mapping[char];
            if (color) {
              forEach({
                x:x,
                y:y,
                color:color
              });
            }
          });
        });
      }
    }
  });
})();
