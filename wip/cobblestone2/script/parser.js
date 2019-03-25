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
        var fileTextBlocks = Object.values(fileData)[0].split("\r").join("").split("\n\n");
        var data = {
          tiles:{},
          palettes:{},
          map:{
            chars:{}
          }
        };
        var maps = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') < 0 && block.indexOf(':') < 0;
        });
        if (maps.length > 1) {
          throw "only one map per file!"
        }
        data.map.map = gridStr(maps[0]);
        var palettes = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') < 0 && block.indexOf(':') >= 0;
        });
        
        var chars = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') >= 0 && block.indexOf(':') >= 0;
        });
        var tiles = fileTextBlocks.filter(function(block) {
          return block.indexOf('"') >= 0 && block.indexOf(':') < 0;
        });
      }
    };
  });
})();
