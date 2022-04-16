function() {
  var renderState = {};
  var charMap = {};
  var render = TileOperations.buildCharTileRenderer(map.chars,function(char) {
    renderState.selectedChar = char;
    renderState.pixels = [];
  },function(x,y,color) {
    renderState.pixels.push({x:x,y:y,color:color});
  },function() {
    charMap[renderState.selectedChar] = renderState.pixels;
  });
  Object.keys(map.chars).forEach(render);
  mapCanvas.clear()
  map.map.forEach(function(row, rowIndex) {
    row.forEach(function(cell, colIndex) {
      mapCanvas.addTile(colIndex, rowIndex, charMap[cell]);
    });
  });
  mapCanvas.drawMapSVG(ui.printerOut);
}(function(){
  var domKeys = [
    'saveButton',
    'paletteSelector',
    'colorSelector',
    'colorPicker',
    'tileSelector',
    'tilePaletteSelector',
    'tileCharIndex',
    'tilePixelInput',
    'tileDisplay',
    'mapInput',
    'mapDisplay',
    "charSelector",
    "tileForMapSelector",
    "paletteForMapSelector",
    "charTileDisplay"
  ];
  registry.apply("RogueController",[
    "FileParser",
    "MapCanvas",
    "Palette",
    "Selector",
    "Tile",
    "TileCanvas",
    "TileMap"
  ],function(FileParser,MapCanvas,Palette,Selector,TileCanvas,Tile,TileMap){
    var parser = new FileParser();
    return function(instanceName,domIds){
      var ui = {};
      var paletteUI = {};
      var tileUI = {};
      var tileMapUI = {};
      var data = {tiles:{},palettes:{},map:{}};
      var palette = new Palette(data.palettes,paletteUI);
      var tileCanvas = new TileCanvas();
      var tile = new Tile('ctrl',tileCanvas,data.tiles,data.palettes,tileUI);
      var mapCanvas = new MapCanvas();
      var mapTileCanvas = new TileCanvas();
      var tileMap = new TileMap(mapCanvas,mapTileCanvas,data.tiles,data.palettes,data.map,tileMapUI);
      var selected = {};
      var reloadView = function() {
        palette.updatePaletteLists();
        tile.reloadView();
        tileMap.reloadView();
      }
      this.init = function() {
        Object.entries(domIds).forEach(function(entry){
          ui[entry[0]] = document.getElementById(entry[1]);
        });
        ['paletteSelector',
        'colorSelector',
        'colorPicker',
        'paletteDisplay',
        'tilePaletteSelector',
        "paletteForMapSelector"].forEach(function(key){
          paletteUI[key] = ui[key];
        });
        palette.updatePaletteLists();
        ['tileSelector',
        'tilePaletteSelector',
        'tileCharIndex',
        'tilePixelInput',
        'tileDisplay',
        'tileForMapSelector'].forEach(function(key){
          tileUI[key] = ui[key];
        });
        ['mapInput',
        'mapDisplay',
        "charSelector",
        "tileForMapSelector",
        "paletteForMapSelector",
        "charTileDisplay",
        "printerOut"].forEach(function(key) {
          tileMapUI[key] = ui[key];
        })
      }
      this.loadFile = function(fileInputId) {
        loadFile(document.getElementById(fileInputId),function(fileData) {
          var jsonFileData = parser.parse(fileData);
          Object.keys(jsonFileData.tiles).forEach(function(key) {
            data.tiles[key] = jsonFileData.tiles[key];
          });
          Object.keys(jsonFileData.palettes).forEach(function(key) {
            data.palettes[key] = jsonFileData.palettes[key];
          });
          data.map.chars = {};
          Object.keys(jsonFileData.map.chars).forEach(function(key) {
            data.map.chars[key] = jsonFileData.map.chars[key];
          });
          data.map.map = jsonFileData.map.map;
          reloadView();
        });
      }
      this.addPalette = function() {
        palette.addPalette()
      }
      this.selectAndDrawPalette = function() {
        palette.selectAndDrawPalette();
      }
      this.selectColorForEditing = function() {
        palette.selectColorForEditing();
      }
      this.addColor = function() {
        palette.addColor();
      }
      this.updateColor = function() {
        palette.updateColor();
      }
      this.makeColorTransparent = function() {
        palette.makeColorTransparent();
      }
      this.removeSelectedColorFromPalette = function() {
        palette.removeSelectedColorFromPalette();
      }
      this.addTile = function() {
        tile.addTile();
      }
      this.swapPrevTileChar = function(index) {
        tile.swapPrevTileChar(index);
      }
      this.swapNextTileChar = function(index) {
        tile.swapNextTileChar(index);
      }
      this.updateAndDrawTile = function() {
        tile.updateAndDrawTile();
      }
      this.drawTile = function() {
        tile.drawTile();
      }
      this.drawMap = function() {
        tileMap.drawMap();
      }
      this.updateAndDrawMap = function() {
        tileMap.updateAndDrawMap();
      }
      this.selectAndDrawChar = function() {
        tileMap.selectAndDrawChar();
      }
      this.selectTileForChar = function() {
        tileMap.selectTileForChar();
      }
      this.selectPaletteForChar = function() {
        tileMap.selectPaletteForChar();
      }
      this.applyTransform = function(input,transform) {
        tileMap.applyTransform(input.checked,transform);
      }
    }
  })
})();
