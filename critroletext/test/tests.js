(function(){
  var mockRandom = function() {
    var values = Array.from(arguments);
    Math.random = function() {
      var value = values.shift();
      values.push(value);
      return value;
    }
    return values;
  }
  var buildMockUI = function() {
    var data = [];
    return {
        data:data,
        println:function(str) {
          data.push(str + "\n");
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
    var mockedRandoms = mockRandom(0.5);
    return {
      "This_test_will_fail":function() {
        assert(false);
      },
      "Test_random":function() {
        assertEquals(Math.random(),"0.5");
      }
    };
  })()
})();
