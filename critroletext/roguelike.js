(function(){
  window.RogueLikeMap = function(ui,config) {
    var decodeLoc = function(loc) {
      var col = loc.codePointAt(0) - "A".codePointAt(0);
      var row = parseInt(loc.slice(1)) - 1;
      return {col:col,row:row};
    }
    var distance = function(a,b) {
      return Math.max(Math.abs(a.col,b.col),Math.abs(a.row,b.row));
    }
    var stringArrayMaxLength = function(strArray) {
      return Math.max.apply(null,strArray.map(function(c){
        return c.length;
      }));
    }
    var buildRow = function(indexMaxWidth,maxWidth,between,after,keyFn) {
      return function(member,index){
        var postBuffer = maxWidth - member.length;
        var coord = keyFn(index);
        var width = coord.length;
        var buffer = indexMaxWidth - width;
        var row = " ".repeat(config.tabSize + buffer);
        row += coord;
        row += between;
        row += member;
        row += " ".repeat(postBuffer);
        row += after;
        row += " ".repeat(config.tabSize);
        ui.output.println(row);
      }
    }
    var draw = function() {
      var rows = config.map.length;
      var cols = stringArrayMaxLength(config.map);
      var drawMap = config.map.map(function(row){
        return (row + " ".repeat(cols - row.length)).split("");
      });
      var sprites = {};
      sprites = config.party.reduce(function(out,name,index){
        out[config.locs[name]] = (index + 1) + "";
        return out;
      },sprites);
      sprites = config.foes.reduce(function(out,name,index){
        out[config.locs[name]] = String.fromCharCode("a".charCodeAt(0) + index);
        return out;
      },sprites);
      Object.entries(sprites).forEach(function(entry){
        var sprite = entry[1];
        var loc = decodeLoc(entry[0]);
        drawMap[loc.row][loc.col] = sprite;
      });
      console.log(drawMap);
      drawMap = drawMap.map(function(row){
        return row.join("");
      });
      drawMap.forEach(function(row){
        console.log(row);
      });
      var rowDigitMax = String.valueOf(rows.length).length;
      var colHeader = "A".repeat(cols).split("").map(function(c,i){
        return String.fromCharCode(c.charCodeAt(0) + i);
      }).join("");
      ui.output.clearOutput();
      ui.output.println(" ".repeat(config.tabSize + rowDigitMax + 1) + colHeader);
      ui.output.println(" ".repeat(config.tabSize + rowDigitMax) + "+" + "-".repeat(cols) + "+" + " ".repeat(config.tabSize));
      drawMap.forEach(buildRow(rowDigitMax,cols,"|","|",function(index){
        return (index + 1) + "";
      }));
      ui.output.println(" ".repeat(config.tabSize + rowDigitMax) + "+" + "-".repeat(cols) + "+" + " ".repeat(config.tabSize));
      ui.output.println("");
      var partyIndexMaxWidth = String.valueOf(config.party.length).length;
      var partyMaxLength = stringArrayMaxLength(config.party);
      config.party.forEach(buildRow(partyIndexMaxWidth,partyMaxLength," - ","",function(index){
        return (index + 1) + "";
      }));
      ui.output.println("");
      var foesIndexMaxWidth = String.valueOf(config.foes.length).length;
      var foesMaxLength = stringArrayMaxLength(config.party);
      config.foes.forEach(buildRow(foesIndexMaxWidth,foesMaxLength," - ","",function(index){
        return String.fromCharCode("a".charCodeAt(0) + index);
      }));
      ui.output.println("");
      var mapKeyIndexMaxWidth = stringArrayMaxLength(Object.keys(config.mapKey));
      var mapKeyMaxWidth = stringArrayMaxLength(Object.values(config.mapKey));
      var mapKeyRowFn = buildRow(mapKeyIndexMaxWidth,mapKeyMaxWidth," - ","",function(index){
        return index;
      });
      Object.entries(config.mapKey).forEach(function(entry){
        mapKeyRowFn(entry[1],entry[0]);
      });
    }
    var moveChar = function(name,loc) {
      config.locs[name] = loc;
      draw();
    }
    this.moveCharacter = function(index,loc){
      moveChar(config.party[parseInt(index)-1],loc);
    }
    this.moveFoe = function(index,loc) {
      moveChar(config.foes[index.codePointAt(0) - "a".codePointAt(0)],loc);
    }
    this.init = function() {
      draw();
    }
    this.after = function(fn) {
      ui.output.after(fn);
    }
    this.getNearest = function(origin,targets) {
      origin = decodeLoc(origin);
      targets = targets.map(decodeLoc).map(function(loc,index){
        return {
          index:index,
          dist:distance(origin,loc)
        };
      });
      var min = Math.min.apply(null,targets.map(function(t){return t.dist;}));
      return targets.filter(function(t){
        return t.dist == min;
      }).map(function(t){
        return t.index;
      });
    }
  }
})();
