(function(){
  var resolve = function(tpl,state) {
    if ((tpl + "").indexOf("${") >= 0) {
      return eval("`" + tpl.split("${").join("${state.") + "`");
    } else {
      return tpl;
    }
  }
  window.Template = {
    resolveTemplate:function(tpl,state) {
      if ((tpl + "").indexOf("${") >= 0) {
        return eval("`" + tpl.split("${").join("${state.") + "`");
      } else {
        return tpl;
      }
    },
    buildTemplatePrinter:function(state,printer) {
      return function(tpl) {
        printer.println(resolve(tpl,state));
      }
    }
  }
})()
