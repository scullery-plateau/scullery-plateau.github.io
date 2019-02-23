(function(){
  window.Game = function(outputId,consoleId,config) {
    var cli = new Interface(0,75,outputId,consoleId,ActionHandlerFactory(GameData,GameStates));
    this.init = function() {
      try {
        cli.init();
      } catch(e) {
        if (e instanceof Error) {
          alert(e.stack);
        }
          alert(e);
        }
      }
    }
  }
})()
