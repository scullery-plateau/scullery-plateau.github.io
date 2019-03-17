(function(){
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
    "Palette",
    "Selector",
    "SVG",
    "Tile",
    "TileMap"
  ],function(FileParser,Palette,Selector,SVG,Tile,TileMap){
    var parser = new FileParser();
    return function(instanceName,domIds){
      var ui = {};
      var paletteUI = {};
      var tileUI = {};
      var tileMapUI = {};
      var data = {tiles:{},palettes:{},map:{}};
      var palette = new Palette(data.palettes,paletteUI);
      var svg = new SVG();
      var tile = new Tile('ctrl',svg,data.tiles,data.palettes,tileUI);
      var tileMap = new TileMap(svg,data.tiles,data.palettes,data.map,mapUI);
      var selected = {};
      var updateView = function() {
        palette.updatePaletteLists();
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
        "charTileDisplay"].forEach(function(key) {
          tileMapUI[key] = ui[key];
        })
      }
      this.loadFile = function(fileInputId) {
        loadFile(document.getElementById(fileInputId),function(fileData) {
          var jsonFileData = parser.parse(fileData);
          ["tiles","palettes","map"].forEach(function(key) {
            state[key] = jsonFileData[key];
          });
          updateView();
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
