(function(){
  var formatResult = function(result){
    return '<tr class="' + (result.error?"fail":"success") + '"><td>' + result.name + "</td><td>" + (result.error?result.error:"PASSED") + "</td></tr>";
  }
  var runTests = function(testMap,namePath) {
    return Object.entries(testMap).reduce(function(out,test){
      var name = namePath + test[0];
      if ((typeof test[1]) == "function") {
        try {
          test[1]();
          out.push(formatResult({name:name}));
        } catch(e) {
          out.push(formatResult({name:name,error:e.message}))
        }
      } else {
        return out.concat(runTests(test[1],name + "."))
      }
      return out;
    },[]);
  }
  window.TestRunner = function(testObj,outputId){
    this.run = function() {
      document.getElementById(outputId).innerHTML = "<table>" + runTests(testObj,"").join("") + "</table>";
    }
  }
})();
