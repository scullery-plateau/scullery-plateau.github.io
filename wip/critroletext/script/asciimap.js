(function(){
  registry.apply("AsciiMap",["MapMath"],function(MapMath){
    var init = function(map,legend,sprites,groups,tabSize) {
      var temp = {maxCol:0};
      var rows = map.map(function(row) {
        var out = row.split("");
        temp.maxCol = Math.max(temp.maxCol,out.length);
      });
      var shortRowCount = rows.filter(function(row){
        return row.length < temp.maxCol;
      });
      if (shortRowCount > 0) {
        throw "Incomplete Map";
      }
      var locs = {};
      var key = {};
      var byGroup = {};
      sprites.forEach(function(sprite){
        locs[sprite.sprite] = sprite.loc;
        key[sprite.sprite] = sprite.label;
        byGroup[sprite.group] = byGroup[sprite.group] || [];
        byGroup[sprite.group].push(sprite.sprite);
      });
      var listByGroup = groups.map(function(group){
        return byGroup[group];
      });
      var spaces = rows.reduce(function(out,row,rowIndex){
        return row.reduce(function(output,cell,colIndex){
          var loc = MapMath.encodeLoc(rowIndex,colIndex);
          out[loc] = cell;
          return out;
        },out);
      },{});
      var out = {
        tabSize:tabSize,
        width:temp.maxCol,
        height:rows.length,
        baseMap:rows,
        spaces:spaces,
        locs:locs,
        key:key,
        byGroup:listByGroup,
        legend:legend
      };
      return out;
    }
    var stringArrayMaxLength = function(strArray) {
      return strArray.map(function(c){
        return c.length;
      }).reduce(Math.max,0);
    }
    var buildRow = function(lines,tabSize,indexMaxWidth,maxWidth,between,after,keyFn) {
      return function(member,index){
        var postBuffer = maxWidth - member.length;
        var coord = keyFn(index);
        var width = coord.length;
        var buffer = indexMaxWidth - width;
        var row = " ".repeat(tabSize + buffer).split("");
        row = row.concat(coord.split(""));
        row = row.concat(between.split(""));
        row = row.concat(member);
        row = row.concat(" ".repeat(postBuffer).split(""));
        row = row.concat(after.split(""));
        row = row.concat(" ".repeat(tabSize).split(""));
        lines.push(row);
      }
    }
    var buildDraw = function(output,mapState) {
      return function(options) {
        options = options || {};
        options.activeSpaces = options.activeSpaces || {};
        options.activeSprites = options.activeSprites || {};
        options.build = options.build || function(){};
        var currentMap = JSON.parse(JSON.stringify(mapState.baseMap));
        var sprites = {};
        sprites = Object.entries(mapState.locs).reduce(function(out,member){
          if (options.activeSprites[member[0]]) {
            out[member[1]] = options.build(member[0],member[0]);
          } else {
            out[member[1]] = member[0];
          }
          return out;
        },sprites);
        sprites = Object.keys(options.activeSpaces).reduce(function(out,space){
          out[member[0]] = options.build(mapState.spaces[member[0]],member[0]);
          return out;
        },sprites);
        Object.entries(sprites).forEach(function(entry){
          var sprite = entry[1];
          var loc = MapMath.decodeLoc(entry[0]);
          currentMap[loc.row][loc.col] = sprite;
        });
        var rowDigitMax = String.valueOf(mapState.height).length;
        var colHeader = "A".repeat(mapState.width).split("").map(function(c,i){
          return String.fromCharCode(c.charCodeAt(0) + i);
        }).join("");
        var lines = [];
        lines.push(" ".repeat(mapState.tabSize + rowDigitMax + 1) + colHeader);
        lines.push(" ".repeat(mapState.tabSize + rowDigitMax) + "\u250C" + "\u2500".repeat(mapState.width) + "\u2510" + " ".repeat(mapState.tabSize));
        currentMap.forEach(buildRow(lines,mapState.tabSize,rowDigitMax,mapState.width,"\u2502","\u2502",function(index){
          return (index + 1) + "";
        }));
        lines.push(" ".repeat(mapState.tabSize + rowDigitMax) + "\u2514" + "\u2500".repeat(mapState.width) + "\u2518" + " ".repeat(mapState.tabSize));
        lines.push("");
        var labelMaxLength = stringArrayMaxLength(Object.values(mapState.key));
        var labeler = buildRow(lines,mapState.tabSize,1,labelMaxLength," - ","",function(index){
          return index;
        });
        mapState.byGroup.forEach(function(group){
          group.forEach(function(sprite){
            labeler(mapState.key[sprite],sprite);
          });
          lines.push("");
        });
        var legendKeyLength = stringArrayMaxLength(Object.keys(mapState.legend));
        var legendLength = stringArrayMaxLength(Object.values(mapState.legend));
        var mapKeyRowFn = buildRow(lines,mapState.tabSize,legendKeyLength,legendLength," - ","",function(index){
          return index;
        });
        Object.entries(mapState.legend).forEach(function(entry){
          mapKeyRowFn(entry[1],entry[0]);
        });
        output.clearOutput();
        lines.forEach(output.println);
      }
    }
    var AsciiMap = function(output,baseMap,legend,sprites,spriteGroups,tabSize){
      var mapState = init(baseMap,legend,sprites,spriteGroups,tabSize)
      var draw = buildDraw(output,mapState);
      this.draw = function() {
        draw();
      }
      this.move = function(spriteId,moveTo) {
        mapState.locs[spriteId] = moveTo;
        draw();
      }
      this.setActiveSpaces = function(spaces,activeSpaceFactoryFn) {
        draw({activeSpaces:spaces,build:activeSpaceFactoryFn});
      }
      this.setActiveSprites = function(sprites,activeSpriteFactoryFn) {
        draw({activeSprites:sprites,build:activeSpriteFactoryFn});
      }
      this.updateLabels = function(newLabels) {
        Object.entries(newLabels).forEach(function(entry){
          mapState.key[entry[0]] = entry[1];
        });
        draw();
      }
      this.open = function() {
        var taken = Object.values(mapState.locs);
        return Object.keys(mapState.spaces).filter(function(space){
          return taken.indexOf(space) < 0;
        });
      }
      this.locs = function() {
        return JSON.parse(JSON.stringify(mapState.locs));
      }
    }
    return AsciiMap;
  });
})()
