(function(){
  var transforms = {
    flipdown:function(p) {
      return Object.assign(p,{
        x:p.x,
        y:(15-p.y)
      });
    },
    flipover:function(p) {
      return Object.assign(p,{
        x:(15-p.x),
        y:p.y
      });
    },
    turnright:function(p) {
      return Object.assign(p,{
        x:(15-p.y),
        y:p.x
      });
    },
    turnleft:function(p) {
      return Object.assign(p,{
        x:p.y,
        y:(15-p.x)
      });
    }
  }
  var charTileRenderer = function(chars,tiles,palettes,init,forEachPixel,forTile) {
    return function(char) {
      if(chars[char]) {
        var charObj = chars[char];
        if (tiles[charObj.tile]) {
          if (palettes[charObj.palette]) {
            var tile = tiles[charObj.tile];
            var palette = palettes[charObj.palette];
            init(char);
            applyPaletteToTile(palette,tile,applyTransforms(function(pixel) {
              forEachPixel(pixel.x,pixel.y,pixel.color);
            }, charObj.transforms));
            forTile();
          }
        }
      }
    }
  }
  var applyPaletteToTile = function(palette,tile,forEach) {
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
  var applyTransforms = function(finalFn,tfs) {
    return function(pix) {
      return finalFn(Object.keys(tfs).reduce(function(p,tf) {
        if(tfs[tf]) {
          return transforms[tf](p);
        }
      },pix));
    }
  }
  registry.apply("TileOperations",[
  ],function(){
    return {
      getTransformNames:function(){
        return Object.keys(transforms);
      },
      applyTransforms:applyTransforms,
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
        updateFn(allChars,newCharIndex);
      },
      applyPaletteToTile:applyPaletteToTile,
      buildCharTileRenderer:charTileRenderer
    }
  });
})();
