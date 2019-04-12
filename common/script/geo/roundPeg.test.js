(function(){
  registry.apply("RoundPegTest",[
    "RoundPeg"
  ],function(RoundPeg){
    return function() {
      var roundPeg = new RoundPeg();
      this.testOne1x1 = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "1":1
        }),[{
          "1":[{x:0,y:0}]
        }])
      }
      this.testOne2x2 = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "2":1
        }),[{
          "2":[{x:0,y:0}]
        }])
      }
      this.testOne3x3 = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "3":1
        }),[{
          "3":[{x:0,y:0}]
        }])
      }
      this.testOne4x4 = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":1
        }),[{
          "4":[{x:0,y:0}]
        }])
      }
      this.testOneOfEach = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":1,
          "3":1,
          "2":1,
          "1":1
        }),[{
          "4":[{x:0,y:0}],
          "3":[{x:4,y:0}],
          "2":[{x:0,y:4}],
          "1":[{x:7,y:0}]
        }])
      }
      this.testTwoOfEach = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":2,
          "3":2,
          "2":2,
          "1":2
        }),[{
          "4":[{x:0,y:0},{x:4,y:0}],
          "3":[{x:0,y:4},{x:3,y:4}],
          "2":[{x:6,y:4},{x:0,y:7}],
          "1":[{x:6,y:6},{x:7,y:6}]
        }])
      }
      this.testThreeOfEach = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":3,
          "3":3,
          "2":3,
          "1":3
        }),[{
          "4":[{x:0,y:0},{x:4,y:0},{x:0,y:4}],
          "3":[{x:4,y:4},{x:4,y:7}],
          "2":[{x:0,y:8},{x:2,y:8}],
          "1":[{x:7,y:4},{x:7,y:5},{x:7,y:6}]
        },{
          "3":[{x:0,y:0}],
          "2":[{x:3,y:0}]
        }])
      }
      this.testFour4x4fullPage = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":4
        }),[{
          "4":[{x:0,y:0},{x:4,y:0},{x:0,y:4},{x:4,y:4}],
          "2":[{x:0,y:8},{x:2,y:8},{x:4,y:8},{x:6,y:8}]
        },{
          "3":[{x:0,y:0},{x:3,y:0},{x:0,y:3},{x:3,y:3}],
          "1":[{x:6,y:0},{x:7,y:0},{x:6,y:1},{x:7,y:1}]
        }])
      }
      this.testFive4x4fullPage = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":4
        }),[{
          "4":[{x:0,y:0},{x:4,y:0},{x:0,y:4},{x:4,y:4}],
          "2":[{x:0,y:8},{x:2,y:8},{x:4,y:8},{x:6,y:8}]
        },{
          "4":[{x:0,y:0}],
          "3":[{x:4,y:0},{x:4,y:3},{x:0,y:4},{x:3,y:6},{x:0,y:7}],
          "2":[{x:6,y:6}],
          "1":[{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:7,y:4},{x:3,y:4}]
        }])
      }
      this.testSix4x4fullPage = function(tester) {
        tester.deepEquals(roundPeg.paginate({
          "4":4
        }),[{
          "4":[{x:0,y:0},{x:4,y:0},{x:0,y:4},{x:4,y:4}],
          "2":[{x:0,y:8},{x:2,y:8},{x:4,y:8},{x:6,y:8}]
        },{
          "4":[{x:0,y:0},{x:4,y:0}],
          "3":[{x:4,y:0},{x:4,y:3},{x:7,y:0},{x:7,y:3}],
          "2":[{x:6,y:4},{x:6,y:6}],
          "1":[{x:6,y:8},{x:7,y:8},{x:6,y:9},{x:7,y:9}]
        },{
          "3":[{x:0,y:0},{x:3,y:0}],
          "1":[{x:6,y:0},{x:7,y:0}]
        }])
      }
    }
  });
})()
