(function(){
  var decodeLoc = function(loc) {
    var col = loc.codePointAt(0) - "A".codePointAt(0);
    var row = parseInt(loc.slice(1)) - 1;
    return {col:col,row:row};
  }
  var encodeLoc = function(row,col) {
    var rowLabel = row + 1;
    return String.fromCharCode("A".codePointAt(0) + col) + rowLabel;
  }
  var distance = function(a,b) {
    return Math.max(Math.abs(a.col-b.col),Math.abs(a.row-b.row));
  }
  var stringArrayMaxLength = function(strArray) {
    return Math.max.apply(null,strArray.map(function(c){
      return c.length;
    }));
  }
  var buildRow = function(ui,context,indexMaxWidth,maxWidth,between,after,keyFn) {
    return function(member,index){
      var postBuffer = maxWidth - member.length;
      var coord = keyFn(index);
      var width = coord.length;
      var buffer = indexMaxWidth - width;
      var row = " ".repeat(context.map.tabSize + buffer);
      row += coord;
      row += between;
      row += member;
      row += " ".repeat(postBuffer);
      row += after;
      row += " ".repeat(context.map.tabSize);
      ui.output.println(row);
    }
  }
  var draw = function(ui,context) {
    var drawMap = context.map.rows.map(function(row){
      return (row + " ".repeat(context.map.size.cols - row.length)).split("");
    });
    var sprites = {};
    sprites = context.party.reduce(function(out,member,index){
      out[member.loc] = (index + 1) + "";
      return out;
    },sprites);
    sprites = context.foes.reduce(function(out,member,index){
      out[member.loc] = String.fromCharCode("a".charCodeAt(0) + index);
      return out;
    },sprites);
    Object.entries(sprites).forEach(function(entry){
      var sprite = entry[1];
      var loc = decodeLoc(entry[0]);
      drawMap[loc.row][loc.col] = sprite;
    });
    drawMap = drawMap.map(function(row){
      return row.join("");
    });
    var rowDigitMax = String.valueOf(drawMap.length).length;
    var colHeader = "A".repeat(context.map.size.cols).split("").map(function(c,i){
      return String.fromCharCode(c.charCodeAt(0) + i);
    }).join("");
    ui.output.clearOutput();
    ui.output.println(" ".repeat(context.map.tabSize + rowDigitMax + 1) + colHeader);
    ui.output.println(" ".repeat(context.map.tabSize + rowDigitMax) + "+" + "-".repeat(context.map.size.cols) + "+" + " ".repeat(context.map.tabSize));
    drawMap.forEach(buildRow(ui,context,rowDigitMax,context.map.size.cols,"|","|",function(index){
      return (index + 1) + "";
    }));
    ui.output.println(" ".repeat(context.map.tabSize + rowDigitMax) + "+" + "-".repeat(context.map.size.cols) + "+" + " ".repeat(context.map.tabSize));
    ui.output.println("");
    var partyIndexMaxWidth = String.valueOf(context.party.length).length;
    var partyMaxLength = stringArrayMaxLength(context.party);
    context.party.map(function(member){
      return member.name + " (" + member.health + ")";
    }).forEach(buildRow(ui,context,partyIndexMaxWidth,partyMaxLength," - ","",function(index){
      return (index + 1) + "";
    }));
    ui.output.println("");
    var foesIndexMaxWidth = String.valueOf(context.foes.length).length;
    var foesMaxLength = stringArrayMaxLength(context.party);
    context.foes.map(function(member){
      var damage = member.health - member.maxHealth;
      return member.name + " (" + damage + ")";
    }).forEach(buildRow(ui,context,foesIndexMaxWidth,foesMaxLength," - ","",function(index){
      return String.fromCharCode("a".charCodeAt(0) + index);
    }));
    ui.output.println("");
    var mapKeyIndexMaxWidth = stringArrayMaxLength(Object.keys(context.map.legend));
    var mapKeyMaxWidth = stringArrayMaxLength(Object.values(context.map.legend));
    var mapKeyRowFn = buildRow(ui,context,mapKeyIndexMaxWidth,mapKeyMaxWidth," - ","",function(index){
      return index;
    });
    Object.entries(context.map.legend).forEach(function(entry){
      mapKeyRowFn(entry[1],entry[0]);
    });
  }
  var add = function(a,b) {return a + b;}
  var openWithinRange = function(loc,maxRows,maxCols,range,occupied) {
    var decoded = decodeLoc(loc);
    var minRow = Math.max(0,decoded.row-range);
    var maxRow = Math.min(maxRows,decoded.row+range);
    var rowRange = maxRow - minRow + 1;
    var minCol = Math.max(0,decoded.col-range);
    var maxCol = Math.min(maxCols,decoded.col+range);
    var colRange = maxCol - minCol + 1;
    var rows = (new Array(rowRange)).fill(minRow).map(add);
    var cols = (new Array(colRange)).fill(minCol).map(add);
    var locs = rows.reduce(function(out,row) {
      return cols.reduce(function(list,col) {
        var space = encodeLoc(row,col);
        if (space != loc && occupied.indexOf(space) < 0) {
          list.push(space);
        }
        return list;
      }, out);
    }, []);
    return locs;
  }
  var occupiedSpaces = function(context) {
    return context.order.map(function(c){return c.loc;});
  }
  window.RogueLikeMap = function(ui,context) {
    context.map.size = {
      rows:context.map.rows.length,
      cols:stringArrayMaxLength(context.map.rows)
    };
    var moveChar = function(character,loc) {
      character.loc = loc;
      draw(ui,context);
    }
    this.draw = function() {
      draw(ui,context);
    }
    this.moveCharacter = function(index,loc){
      moveChar(context.party[parseInt(index)-1],loc);
    }
    this.moveFoe = function(index,loc) {
      moveChar(context.foes[index.codePointAt(0) - "a".codePointAt(0)],loc);
    }
    this.init = function() {
      draw(ui,context);
    }
    this.after = function(fn) {
      ui.output.after(fn);
    }
    this.openWithinRangeOfHero = function() {
      var hero = context.turn;
      return openWithinRange(hero.loc,
        context.map.size.rows-1,
        context.map.size.cols-1,
        hero.movement/5,
        occupiedSpaces(context));
    }
    this.openAdjacentWithinRangeOfFoe = function() {
      var foe = context.turn;
      var occupied = occupiedSpaces(context);
      var open = openWithinRange(foe.loc,
        context.map.size.rows-1,
        context.map.size.cols-1,
        foe.movement/5,
        occupied);
      return context.party.reduce(function(out,m,i) {
        return openWithinRange(m.loc,
          context.map.size.rows-1,
          context.map.size.cols-1,
          1,
          occupied).filter(function(o){
            return open.indexOf(o) >= 0;
          }).reduce(function(list,o) {
            var a = decodeLoc(foe.loc);
            var b = decodeLoc(o);
            var dist = distance(a,b);
            list.push({
              index:i,
              open:o,
              distance:dist,
            });
            return list;
          }, out);
      }, []);
    }
  }
})();
