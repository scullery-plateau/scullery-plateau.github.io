(function(){
  window.assert = function(pred,message) {
    if(!pred) {
      if(message) {
        throw message;
      } else {
        throw "Predicate failed"
      }
    }
  }
  window.assertEquals = function(actual,expected,message) {
    if (actual != expected) {
      var diff = {
        actual:actual,
        expected:expected
      }
      if(message) {
        diff.message = message
      }
      throw diff;
    }
  }
})();
