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
    "flipdownSwitch",
    "flipoverSwitch",
    "turnrightSwitch",
    "turnleftSwitch",
    "charTileDisplay"
  ]
  registry.apply("RogueController",[
    "FileParser",
    "Selector",
    "Palette"
  ],function(FileParser,Selector,Palette){
    var parser = new FileParser();
    return function(instanceName,domIds){
      var ui = {};
      var paletteUI = {};
      var data = {tiles:{},palettes:{},map:{}};
      var palette = new Palette('ctrl',data.palettes,paletteUI)
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
      this.addTile = function(selectorId) {
        var tileName = prompt("What do you want to name this tile?");
        if (data.tiles[tileName]) {
          alert("There is already a tile named '" + tileName + "'.");
        } else {
          data.tiles[tileName] = {};
          Selector.loadSelector(ui.tileSelector,Object.keys(data.tiles),"Choose a tile:");
          Selector.loadSelector(ui.tileForMapSelector,Object.keys(data.tiles),"Choose a tile:");
        }
      }
      this.selectAndDrawTile = function(selector,inputId,textAreaId,outputId) {

      }
      this.updateTileCharIndex = function(input,textAreaId,outputId) {

      }
      this.selectPaletteForTile = function(input,textAreaId,charIndexId,outputId) {

      }
      this.drawTile = function(input,charIndexId,paletteSelectorId,outputId) {

      }
      this.drawMap = function(input,outputId) {

      }
      this.updateMapCharIndex = function(input,charselectId) {

      }
      this.toggleChar = function(input) {

      }
      this.selectTileForChar = function(input) {

      }
      this.selectPaletteForChar = function(input) {

      }
      this.applyTransform = function(index,transform) {

      }
    }
  })
})();
