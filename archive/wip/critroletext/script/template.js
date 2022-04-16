(function(){
  registry.apply("Template",[],function(){
    var resolve = function(tpl,state) {
      if ((tpl + "").indexOf("${") >= 0) {
        return eval("`" + tpl.split("${").join("${state.") + "`");
      } else {
        return tpl;
      }
    }
    return  {
      resolveTemplate:resolve,
      buildTemplatePrinter:function(state,printer) {
        return function(tpl) {
          printer.println(resolve(tpl,state));
        }
      },
      applyToContext:function(ctx,update) {
        Object.entries(update).forEach(function(entry){
          ctx[entry[0]] = resolve(entry[1],ctx);
        });
      }
    }
  });
})()
