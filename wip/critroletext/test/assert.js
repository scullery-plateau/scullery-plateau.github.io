(function(){
  window.assert = function(pred,message) {
    if(!pred) {
      if(!message) {
        message = "Predicate failed";
      }
      throw new Error(message);
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
      throw new Error(JSON.stringify(diff));
    }
  }
})();
