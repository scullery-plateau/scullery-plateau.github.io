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
    'mapDisplay',
    'charList',
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
  var buildCharListItem = function(index){
    return `<li>
  <input type="checkbox" checked id="collapseChar${index}" onClick="ctrl.toggleChar(this,${index})"/><label id="collapseLabel${index}" for="collapseChar${index}"></label>
  <div id="charCtrl${index}">
    <p><label for="tileForMap${index}">Tile: </label><select id="tileForMap${index}" onselect="ctrl.selectTileForChar(this,${index})"></select></p>
    <p><label for="paletteForMap${index}">Palette: </label><select id="paletteForMap${index}" onselect="ctrl.selectPaletteForChar(this,${index})"></select></p>
    <table>
      <tr>
        <td>
          <label>Orient:</label>
          <ul>
            <li><input type="checkbox" id="flipdown${index}" onclick="ctrl.applyTransform(this,'flipdown',${index})"/><label for="flipdown${index}">Flip Down</label></li>
            <li><input type="checkbox" id="flipover${index}" onclick="ctrl.applyTransform(this,'flipover',${index})"/><label for="flipover${index}">Flip Over</label></li>
            <li><input type="checkbox" id="turnright${index}" onclick="ctrl.applyTransform(this,'turnright',${index})"/><label for="turnright${index}">Turn Right</label></li>
            <li><input type="checkbox" id="turnleft${index}" onclick="ctrl.applyTransform(this,'turnleft',${index})"/><label for="turnleft${index}">Turn Left</label></li>
          </ul>
        </td>
        <td>
          <label for="showTile${index}">Tile: </label>
          <br/>
          <div id="showTile${index}"></div>
        </td>
      </tr>
    </table>
  </div>
</li>`;
  }
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
      this.updateMapCharIndex = function(input,charListingId) {

      }
      this.toggleChar = function(input,index) {

      }
      this.selectTileForChar = function(input,index) {

      }
      this.selectPaletteForChar = function(input,index) {

      }
      this.applyTransform = function(index,transform,index) {

      }
    }
  })
})();
