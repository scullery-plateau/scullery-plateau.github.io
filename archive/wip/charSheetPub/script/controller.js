(function(){
  registry.apply("CharSheetController",[
    "CharMath","CharSheetParser","CharSheetTemplate"
  ],function(CharMath,CharSheetParser,CharSheetTemplate){
    return function(loadId,printId) {
      var parser = new CharSheetParser();
      var template = new CharSheetTemplate();
      var charMath = new CharMath();
      this.loadFile = function() {
        loadFile(document.getElementById(loadId),function(fileData) {
          var singleFileData = Object.values(fileData)[0];
          var charSheet = parser.parse(singleFileData);
          charMath.resolve(charSheet);
          console.log(charSheet);
          document.getElementById(printId).innerHTML = template.applyTemplate(charSheet);
          window.charSheet = charSheet;
        });
      }
    }
  });
})();
