(function(){
  registry.apply("RogueBuilder",[
    "FileValidator"
  ],function(FileValidator){
    
    var Builder = function(inputId, outputId) {
      var ui = {};
      this.init = function() {
        ui.input = document.getElementById(inputId);
        ui.output = document.getElementById(outputId);
      };
      this.buildmap = function() {
        loadFile(ui.input,function(fileData) {
        });
      };
    }
    return Builder;
  });
})();
