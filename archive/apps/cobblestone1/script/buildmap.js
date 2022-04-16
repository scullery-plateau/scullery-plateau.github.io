(function() {
  var transformer = new Transformer(16);
  var tileParser = new TileParser(16,16);
  
  var tf = ["flip-down","flip-over","turn-left","turn-right"].reduce(function(out,fn) {
    out[fn] = function(p) {
      return p.merge(transformer[fn](new Point(p.x,p.y)).toJSON());
    }
    return out;
  },{})
  
  var buildTransform = function(transforms) {
    return (p) => transforms.reduce((p1,f) => f(p1),p);
  }
  
  var applyPalette = function(palette) {
    return function(p) {
      p.c = palette[p.c];
      return p;
    }
  }
  
  var decodeChar = function (c) { return c.charCodeAt(0) - 97; }

  var explodeCoords = function(coords){
    coords = coords.reduce(function(out,coord){
      var xy = coord.split("/");
      var x = xy[0].split("").map(decodeChar);
      var y = xy[1].split("").map(decodeChar);
      var xa = x[0];
      var xb = x[1] || xa;
      var ya = y[0];
      var yb = y[1] || ya;
      return Number.range(ya,yb+1).reduce(function(out,y){
        return out.concat(Number.range(xa,xb+1).map((x) => Object.map("x",x,"y",y)));
      },[]);
    },[]);
    return coords;
  }
  
  var drawSquare = function(coord,ctx) {
    return function(point) {
      if (point.c != "none") {
        var xy = ["x","y"].reduce(function(out, key){
          out[key] = 6 * (point[key] + 16 * coord[key]);
          return out;
        },{});
        ctx.fillStyle = point.c;
        ctx.fillRect(xy.x, xy.y, 6, 6);
      }
    }
  }
  
  var applyToCtx = function(ctx) {
    return function(entry) {
      entry.coords.forEach(function(coord) {
        entry.tile.forEach(drawSquare(coord, ctx));
        ctx.lineWidth = 1;
        ctx.strokeRect(coord.x * 96, coord.y * 96, 96, 96);
      });
    }
  };
  
  var buildGalleryBuilder = function(gallery, buildspace) {
    return function(inData) {
      buildspace.innerHTML = "";
      gallery.innerHTML = "";
      var tiles = inData[0] || {};
      tiles = Object.entries(tiles).reduce(function(out,entry){
        out[entry[0]] = tileParser.parse(entry[1]);
        return out;
      },{});
      console.log(tiles);
      var palettes = inData[1] || {};
      palettes = Object.entries(palettes).reduce(function(out,entry){
        out[entry[0]] = entry[1].map((c) => Array.isArray(c)?"rgb(" + c.join(",") + ")":c);
        return out;
      },{});
      var pages = inData[2] || {};
      gallery.innerHTML = Object.entries(pages).map(function(entry){
        var key = entry[0];
        var page = entry[1];
        var exploded = page.reduce(function(out,step){
          return Object.entries(step).reduce(function(o,entry){
            var key = entry[0].split("|");
            var tile = tiles[key.shift()];
            var palette = palettes[key.shift()];
            o.push({
              tile:tile.map(buildTransform(key.map((k) => tf[k]).concat(applyPalette(palette)))),
              coords:explodeCoords(entry[1])
            });
            return o;
          },out)
        },[]);
        var coords = [].concat.apply([],exploded.map((x) => x.coords));
        var max = coords.reduce(function(out,coord){
          return ["x","y"].reduce(function(obj,key) {
            obj[key] = Math.max(out[key],coord[key]);
            return obj;
          },{});
        },{x:0,y:0});
        buildspace.innerHTML += '<canvas id="' + key + '"></canvas>';
        var canvas = document.getElementById(key);
        canvas.width = (1 + max.x) * 96;
        canvas.height = (1 + max.y) * 96;
        exploded.forEach(applyToCtx(canvas.getContext('2d'),tiles,palettes));
        var img = canvas.toDataURL("image/png");
        return '<img src="' + img + '" alt="' + key + '"/>';
      }).join("");
    }
  }

  window.Builder = function (inId,canvasId,galleryId) {
    var input = document.getElementById(inId);
    var buildspace = document.getElementById(canvasId);
    var gallery = document.getElementById(galleryId);
    var buildGallery = buildGalleryBuilder(gallery, buildspace);
    this.buildmap = function() {
      loadFile(input,function(contents){
        var dataObj = Object.entries(contents).reduce(function(out,entry){
          var json = JSON.parse(entry[1]);
          Object.entries(json[0]).forEach(function(tile){
            out.tiles[tile[0]] = tile[1];
          });
          Object.entries(json[1]).forEach(function(palette){
            out.palettes[palette[0]] = palette[1];
          });
          Object.entries(json[2]).forEach(function(page){
            out.pages[page[0]] = page[1];
          });
          return out;
        },{tiles:{},palettes:{},pages:{}});
        var inData = [dataObj.tiles,dataObj.palettes,dataObj.pages];
        console.log("inData");
        console.log(inData);
        buildGallery(inData);
      });
    }
  };
})()