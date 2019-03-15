(function(){
  var domKeys = [
    'saveButton',
    'paletteSelector',
    'paletteInput',
    'paletteDisplay',
    'tileSelector',
    'tilePaletteSelector'
    'tileCharIndex',
    'tilePixelInput',
    'tileDisplay',
    'mapInput',
    'mapDisplay'
  ];
  var charDomKeys = [
    "collapseLabel",
    "tileForMap",
    "paletteForMap",
    "flipdown",
    "flipover",
    "turnright",
    "turnleft",
    "showTile"
  ]
  registry.apply("RogueController",[
    "FileParser",
    "Selector"
  ],function(FileParser,Selector){
    var parser = new FileParser();
    return function(instanceName,domIds){
      var ui = {};
      var state = {tiles:{},palettes:{},map:{}};
      var updateView = function() {

      }
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

      }
      this.selectAndDrawPalette = function(selector,inputId,outputId) {

      }
      this.drawPalette = function(input,outputId) {

      }
      this.addTile = function(selectorId) {

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
