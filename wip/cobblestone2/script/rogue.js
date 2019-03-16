(function(){
  var domKeys = [
    'saveButton',
    'paletteSelector',
    'paletteInput',
    'paletteDisplay',
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
    "PaletteDisplay"
  ],function(FileParser,Selector){
    var parser = new FileParser();
    return function(instanceName,domIds){
      var ui = {};
      var data = {tiles:{},palettes:{},map:{}};
      var selected = {};
      var updateView = function() {}
      this.init = function() {
        Object.entries(domIds).forEach(function(entry){
          ui[entry[0]] = document.getElementById(entry[1]);
        });
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
      this.addPalette = function(selectorId) {
        var paletteName = prompt("What do you want to name this palette?");
        if (data.palettes[paletteName]) {
          alert("There is already a palette named '" + paletteName + "'.");
        } else {
          data.palettes[paletteName] = {};
          Selector.loadSelector(ui.paletteSelector,Object.keys(data.palettes),"Choose a palette:");
          Selector.loadSelector(ui.tilePaletteSelector,Object.keys(data.palettes),"Choose a palette:");
          Selector.loadSelector(ui.paletteForMapSelector,Object.keys(data.palettes),"Choose a palette:");
        }
      }
      this.selectAndDrawPalette = function(selector,inputId,outputId) {

      }
      this.drawPalette = function(input,outputId) {

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
