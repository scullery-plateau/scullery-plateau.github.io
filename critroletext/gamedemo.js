(function(){
  window.Game = function(outputId,consoleId,config) {
    var cli = new Interface(0,75,outputId,consoleId,ActionHandlerFactory(GameData));
    this.init = function() {
      cli.init();
    }
  }
})()
