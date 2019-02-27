(function(){
    window[registryName].apply('BuilderProto',
    ['TileTransformer','MapBuilder','MapParser','TileParser','ColorConstants','Point','Transformer','PixelPainter'],
    function(TileTransformer, MapBuilder, MapParser, TileParser, Point, ColorConstants, Transformer, PixelPainter) {

      var tf = new Transformer(16);
      var tileParser = new TileParser(16,16);
      var mapParser = new MapParser();
      var mapBuilder = new MapBuilder(16,16);
      var pixelPainter = new PixelPainter(6);
      
      var compileFiles = function(contents) {
         return Object.entries(contents).reduce(function(out,entry){
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
      }
      
      var buildMapBuilder = function(uiBuilder, uiDisplay) {
        return function(contents) {
          var data = compileFiles(contents);
          uiBuilder.innerHTML = data.pages.keys().map((k) => '<canvas id="page_' + k + '"/>').join("");
          var canvases = data.pages.keys().reduce(function(out,key){
            out[key] = document.getElementById("page_" + key);
            return out;
          },{});
          data.tiles = Object.entries(data.tiles).reduce(function(tiles,tile){
            tiles[tile[0]] = tileParser.parse(tile[1]);
            return tiles;
          },{})
          var tileTF = new TileTransformer(data.tiles,data.palettes);
          data.transforms = data.pages.entries().reduce(function(pages,page){
            pages[page[0]] = page[1].reduce(function(levels,level){
              return [].concat(levels, level.entries().reduce(function(transforms,transform){
                var result = tileTF.buildTransform(transform[0]);
                result.coords = mapParser.explodeCoords(transform[1]);
                transforms[transform[0]] = result;
                return transforms;
              },{}));
            },[]);
            return pages;
          },{});
          data.pixels = data.transforms.entries().reduce(function(pages,page){
            var allCoords = [];
            var pagePixels = page[1].reduce(function(pixels,level){
              level.values().forEach(function(transform){
                var bg = transform.bg;
                var coords = transform.coords;
                allCoords = [].concat(allCoords,coords);
                var tile = transform.tile;
                mapBuilder.placePixels(tile,bg,pixels,coords);
              })
              return pixels;
            },{});
            var xs = allCoords.map((c) => c.x);
            var ys = allCoords.map((c) => c.y);
            var maxX = Math.max.apply(null, xs);
            var maxY = Math.max.apply(null, ys);
            pages[page[0]] = {
              pixels: pagePixels,
              width: (maxX + 1) * 16,
              height: (maxY + 1) * 16
            }
            return pages;
          },{});
          console.log(data);
          
          uiDisplay.innerHTML = data.pixels.entries().map(function(entry){
            var key = entry[0];
            var page = entry[1];
            pixelPainter.setCanvas(canvases[key]);
            var base64 = pixelPainter.paint(page.width,page.height,page.pixels);
            return '<img id="' + key + '" src="' + base64 + '"/>';
          }).join("");
        };
      }
      
      return function(inputId,builderId,displayId) {
        var ui = {};
        
        this.init = function(){
          ui.input = document.getElementById(inputId);
          ui.builder = document.getElementById(builderId);
          ui.display = document.getElementById(displayId);
        }
        
        this.build = function() {
          loadFile(ui.input,buildMapBuilder(ui.builder,ui.display));
        }
      }
    });
})()