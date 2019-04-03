(function(){
  registry.apply("FileParser",[
  ],function(){
    return function(){
      var splitGrid = function(gridStr) {
        return gridStr.split("\n").map(function(row) {
          return row.split("");
        });
      }
      this.parse = function(fileData) {
        return JSON.parse(Object.values(fileData)[0]);
      }
      this.parseMapFile = function(fileData) {
        var fileTextBlocks = Object.values(fileData)[0].split("\r").join("");
        while (fileTextBlocks.indexOf("\n\n\n") >= 0) {
          fileTextBlocks = fileTextBlocks.split("\n\n\n").join("\n\n");
        }
        fileTextBlocks = fileTextBlocks.split("\n\n");
        var data = {
          tiles:{},
          palettes:{},
          map:{
            chars:{}
          }
        };
        data.map.maps = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') < 0 && block.indexOf(':') < 0;
        }).map(splitGrid);
        data.palettes = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') < 0 && block.indexOf(':') >= 0;
        }).reduce(function(out,block){
          return block.split("\n").reduce(function(paletteMap,row){
            var kv = row.split("\:");
            var paletteName = kv[0].trim();
            var colors = kv[1].trim().split(",").map(function(c) {
              return c.trim();
            });
            paletteMap[paletteName] = colors;
            return paletteMap;
          },out);
        },{})
        data.map.chars = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') >= 0 && block.indexOf(':') >= 0;
        }).reduce(function(out,block) {
          return block.split("\n").reduce(function(charMap,row) {
            var kv = row.split("\:");
            var char = JSON.parse(kv[0].trim());
            var vars = kv[1].trim().split(",").map(function(elem) {
              return elem.trim();
            });
            var obj = {};
            obj.tile = vars.shift();
            obj.palette = vars.shift();
            obj.transforms = vars.reduce(function(tfs,tf) {
              tfs[tf] = true;
              return tfs;
            }, {});
            charMap[char] = obj;
            return charMap;
          }, out)
        }, {});

        data.tiles = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') >= 0 && block.indexOf(':') < 0;
        }).reduce(function(out,block){
          var rows = block.split("\n");
          var tileName = rows.shift();
          console.log(tileName);
          var tileIndex = JSON.parse(rows.shift()).split("");
          var pixels = rows.map(function(row) {
            return row.split("");
          })
          out[tileName] = {
            index:tileIndex,
            pixels:pixels
          };
          return out;
        }, {});
        return data;
      }
    };
  });
})();
