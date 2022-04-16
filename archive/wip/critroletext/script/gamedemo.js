(function(){
  registry.apply("Game",[
    "Interface","ActionHandlerFactory","GameData","GameStates"
  ],function(Interface,ActionHandlerFactory,GameData,GameStates){
    return function(outputId,consoleId) {
      var cli = new Interface(0,75,outputId,consoleId,ActionHandlerFactory(GameData,GameStates));
      this.init = function() {
        try {
          cli.init();
        } catch(e) {
          if (e instanceof Error) {
            alert(e.stack);
          } else {
            alert(e);
          }
        }
      }
    }
  })
})()
