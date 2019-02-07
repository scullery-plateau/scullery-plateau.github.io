(function(){
  var buildMockUI = function() {
    var data = [];
    return {
        data:data,
        println:function(str) {
          data.push(str + "\n);
        },
        clearOutput:function(){
          data.splice(0,data.length);
        },
        after:function(fn) {
          fn();
        }
    }
  }
  window.allTests = (function(){
    var buildActionHandler = new ActionHandlerFactory(GameData);
    var outputData = []
    var consoleData = [];
    var mockUI = {
      output:buildMockUI(),
      console:buildMockUI()
    }
    var actionHandler = buildActionHandler(mockUI);
    return {
        "Test 1":function() {
          assert(false);
        }
    };
  })()
})();
