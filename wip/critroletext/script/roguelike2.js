(function(){
  registry.apply("RogueLikeMap",["GameRules"],function(GameRules){
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
        var row = " ".repeat(context.map.tabSize + buffer).split("");
        row = row.concat(coord.split(""));
        row = row.concat(between.split(""));
        row = row.concat(member);
        row = row.concat(" ".repeat(postBuffer).split(""));
        row = row.concat(after.split(""));
        row = row.concat(" ".repeat(context.map.tabSize).split(""));
        ui.output.println(row);
      }
    }
    var draw = function(ui,context,options) {
      options = options || {};
      options.open = options.open || {};
      options.foes = options.foes || {};
      var drawMap = context.map.rows.map(function(row){
        return (row + ".".repeat(context.map.size.cols - row.length)).split("");
      });

      var sprites = {};
      sprites = context.party.reduce(function(out,member,index){
        out[member.loc] = (index + 1) + "";
        return out;
      },sprites);
      sprites = context.foes.reduce(function(out,member,index){
        if (member.loc) {
          var sprite = String.fromCharCode("a".charCodeAt(0) + index);
          if (options.foes[sprite]) {
            out[member.loc] = ui.buildActiveSprite(sprite,sprite);
          } else {
            out[member.loc] = sprite;
          }
        }
        return out;
      },sprites);
      sprites = Object.keys(options.open).reduce(function(out,key){
        out[key] = ui.buildActiveSprite(".",key);
        return out;
      },sprites);
      Object.entries(sprites).forEach(function(entry){
        var sprite = entry[1];
        var loc = decodeLoc(entry[0]);
        drawMap[loc.row][loc.col] = sprite;
      });

      var rowDigitMax = String.valueOf(drawMap.length).length;
      var colHeader = "A".repeat(context.map.size.cols).split("").map(function(c,i){
        return String.fromCharCode(c.charCodeAt(0) + i);
      }).join("");
      ui.output.clearOutput();
      ui.output.println(" ".repeat(context.map.tabSize + rowDigitMax + 1) + colHeader);
      ui.output.println(" ".repeat(context.map.tabSize + rowDigitMax) + "\u250C" + "\u2500".repeat(context.map.size.cols) + "\u2510" + " ".repeat(context.map.tabSize));
      drawMap.forEach(buildRow(ui,context,rowDigitMax,context.map.size.cols,"\u2502","\u2502",function(index){
        return (index + 1) + "";
      }));
      ui.output.println(" ".repeat(context.map.tabSize + rowDigitMax) + "\u2514" + "\u2500".repeat(context.map.size.cols) + "\u2518" + " ".repeat(context.map.tabSize));
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
    var occupiedSpaces = function(context) {
      return context.order.map(function(c){return c.loc;});
    }
    return function(ui,context) {
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
      this.drawWithTargets = function() {
        draw(ui,context,{
          foes:context.foes.reduce(function(out,_,i){
            out[String.fromCharCode("a".charCodeAt(0) + i)] = true;
            return out;
          },{})
        });
      }
      this.drawWithOpenSpaces = function() {
        draw(ui,context,{
          open:this.openWithinRangeOfHero().reduce(function(out,coord){
            out[coord] = true;
            return out;
          },{})
        });
      }
      this.moveCharacter = function(index,loc){
        moveChar(context.party[parseInt(index)-1],loc);
      }
      this.moveFoe = function(index,loc) {
        moveChar(context.foes[index.codePointAt(0) - "a".codePointAt(0)],loc);
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
  });
})();
