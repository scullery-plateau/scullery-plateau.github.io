(function(){
  var transforms = {
    flipdown:function(p) {

    },
    flipover:function(p) {

    },
    turnright:function(p) {

    },
    turnleft:function(p) {

    }
  }
  registry.apply("TileOperations",[
  ],function(){
    return {
      getTransformNames:function(){
        return Object.keys(transforms);
      }
      update:function(index,text,updateFn) {
        var rows = text.split("\r").join("").split("\n");
        var chars = rows.join("");
        var newChars = index.reduce(function(myChars,char){
          return myChars.split(char).join("");
        },chars);
        var newCharIndex = [];
        while (newChars.length > 0) {
          var next = newChars[0];
          newCharIndex.push(next);
          newChars = newChars.split(next).join("");
        }
        var allChars = rows.map(function(row) {
          return row.split("");
        });
        update(allChars,newCharIndex);
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
