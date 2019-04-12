(function(){
  var deepEquals = function(a, b, message) {
    message = message || ("expected value does not equal actual value");
    if (a===b) {
      return;
    }
    if (a == b) {
      return;
    }
    if (typeof a !=  typeof b) {
      throw new Error(message);
    }
    var type = typeof a;
    if (type != "object") {
      throw new Error(message);
    }
    var aIsArray = a instanceof Array;
    var bIsArray = b instanceof Array;
    if ((aIsArray && !bIsArray) || (!aIsArray && bIsArray)) {
      throw new Error(message);
    }
    if (aIsArray && bIsArray) {
      if (a.length != b.length) {
        throw new Error(message);
      }
      var length = a;
      for (var x = 0; x < a; x++) {
        if (!deepEquals(a[x], b[x], message)) {
          throw new Error(message);
        }
      }
    } else {
      var aKeys = Object.keys(a);
      var bKeys = Object.keys(b);
      aKeys.sort();
      bKeys.sort();
      if (!deepEquals(aKeys, bKeys, message)) {
        throw new Error(message);
      }
      var keys = Object.keys(a);
      while(keys.length > 0) {
        var key = keys.shift();
        if (!deepEquals(a[key],b[key], message)) {
          throw new Error(message);
        }
      }
    }
    return;
  }
  registry.apply("Testing",[
  ],function(){
    var Expectations = function() {
      this.deepEquals = deepEquals;
      this.fail = function(message) {
        throw new Error(message);
      }
      this.is = function(cond,message) {
        if (!cond) {
          throw new Error(message);
        }
      }
      this.equals = function(a,b,message) {
        message = message || (a + " does not equal " + b);
        if (a != b) {
          throw new Error(message);
        }
      }
    }
    return function() {
      var expect = new Expectations();
      this.run = function(allTests) {
        var results = {};
        Object.entries(allTests).forEach(function(entry){
          var label = entry[0];
          results[label] = results[label] || {};
          var testSet = entry[1];
          var testNames = Object.keys(testSet).filter(function(fnName){
            return fnName.startsWith("test");
          });
          testNames.forEach(function(testName) {
            try {
              testSet[testName](expect);
              results[label][testName] = true;
            } catch(e) {
              results[label][testName] = e;
            }
          })
        });
        return results;
      }
    }
  });
})()
