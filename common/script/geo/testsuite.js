(function(){
  registry.apply("GeoTestSuite",[
    "RoundPegTest",
    "Testing",
    "ResultPrinter"
  ],function(RoundPegTest,Testing,ResultPrinter){
    return function() {
      this.runAll = function(outputId) {
        var tester = new Testing();
        var test = new RoundPegTest();
        var printer = new ResultPrinter(outputId);
        var results = tester.run({
          "RoundPeg":test
        });
        printer.print(results);
      }
    }
  });
})()
