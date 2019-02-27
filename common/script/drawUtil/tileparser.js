(function() {
  var decodeChar = function (c) { return c.charCodeAt(0) - 97; }

  window[registryName].apply('TileParser', ['Point'], function(Point) {
    var safeparse = function(str) {
      var value = parseInt(str);
      return isNaN(value)?str:value;
    };
    
    var byType = {
      string:function(out,val) {
        out.push(val);
        return out;
      },
      number:function(out,val) {
        var prev = out.pop();
        out.push(prev);
        return out.concat(Array.repeat(val, prev));
      }
    };
    
    var finishHex = function(coll) {
      var shortchange = 16 - coll.length;
      if (shortchange > 0) {
        coll = byType.number(coll,shortchange);
      }
      return coll;
    }
    
    return function(width, height) {
      this.parse = function(tileText) {
        var explode = finishHex(tileText.split("|").reduce(function(out, row){
          if (row == "") {
            var step = out.pop();
            out.push(step);
            out.push(step);
          } else {
            out.push(finishHex(row.split("").map(safeparse).reduce(function(step, cell){
              return byType[(typeof cell)](step, cell);
            },[])));
          }
          return out;
        },[]));
        var list = explode.reduce(function(out, row, y){
          return out.concat(row.map((c,x) => Object.map("c", decodeChar(c), "x", x, "y", y)).filter((o) => (0 < o.c)));
        },[]);
        return list.reduce(function(out,p){
          return out.merge(Object.map(new Point(p.x,p.y).toString(),p.c))
        },{});
      }
    }
  });
  window[registryName].apply('MapParser', 
  [], 
  function() {
    var explodeCoords = function(coords){
      var exploded = coords.reduce(function(out,coord){
        var xy = coord.split("/");
        var x = xy[0].split("").map(decodeChar);
        var y = xy[1].split("").map(decodeChar);
        var xa = x[0];
        var xb = x[1] || xa;
        var ya = y[0];
        var yb = y[1] || ya;
        return Number.range(ya,yb+1).reduce(function(out,y){
          return out.concat(Number.range(xa,xb+1).map((x) => Object.map("x",x,"y",y)));
        },out);
      },[]);
      return exploded;
    }
    return function(){
      this.explodeCoords = explodeCoords;
      this.parse = function(myMaps) {
        return myMaps.entries().reduce(function(out,entry) {
          return out.merge(Object.map(entry[0], 
            entry[1].map(function(level){
              return level.entries().reduce(function(out,entry) {
                return out.merge(Object.map(entry[0], explodeCoords(entry[1])));
              }, {})
            })
          ))
        }, 
        {});
      }
    }
  });
  window[registryName].apply('TileTransformer', 
  ['ColorConstants','Point','Transformer'], 
  function(ColorConstants,Point,Transformer) {
    var transformer = new Transformer(16);

    var tf = ["flip-down","flip-over","turn-left","turn-right"].reduce(function(out,fn) {
      out[fn] = function(p) {
        return transformer[fn](new Point(p.x,p.y)).toJSON().assoc("c",p.c);
      }
      return out;
    },{})
    
    var buildTF = function(transforms) {
      return (p) => transforms.reduce((p1,f) => f(p1),p);
    }
    
    var applyPalette = function(palette) {
      return function(p) {
        p.c = ColorConstants.get(palette[p.c]);
        return p;
      }
    }
       
    return function(tiles,palettes) {
      this.buildTransform = function(transform) {
        var transforms = transform.split("|");
        var tileName = transforms.shift();
        //console.log("tile name: " + tileName);
        var paletteName = transforms.shift();
        //console.log("palette name: " + paletteName);
        var tileMap = tiles[tileName];
        var palette = palettes[paletteName];
        //console.log("tileMap");
        //console.log(tileMap);
        var bg = ColorConstants.get(palette[0]) || "none";
        var thisTF = buildTF(transforms.map((k) => tf[k]));
        var tile = tileMap.entries().map(function(entry){
          return thisTF(Point.parse(entry[0]).toJSON()).merge(Object.map("c",entry[1]))
        });
        //console.log("tile");
        //console.log(tile);
        var out = {
          tile:tile.reduce(function(out,p){
            return out.assoc(new Point(p.x, p.y).toString(), ColorConstants.get(palette[p.c]));
          },{})
        };
        if ("none" != bg) {
          out.bg = bg;
        }
        return out;
      }
    }
    
  });
  window[registryName].apply('MapBuilder', ['Point'], function(Point){
    return function(width,height) {
      this.placePixels = function(transform,bg,out,coords) {
        return coords.forEach(function(p){
          Number.range(0,width).forEach(function(x){
            Number.range(0,height).forEach(function(y){
              var tileKey = new Point(x,y).toString();
              var key = new Point(p.x * 16 + x, p.y * 16 + y).toString();
              if (transform[tileKey]) {
                out[key] = transform[tileKey];
              } else if (bg) {
                out[key] = bg;
              }
            });
          });
        });
      }
    }
  });

})()
