(function(){
  function suite(label,tests) {
    return `<li><h2>${label}</h2><ul>${tests}</ul></li>`;
  }
  function test(name,err) {
    return `<li><h3>${name}</h3>${err}</li>`;
  }
  function err(message,stack) {
    return `<h4>${message}</h4>
    <code>${stack}</code>`
  }
  registry.apply("ResultPrinter",[
  ],function(){
    return function(outputId) {
      this.print = function(results) {
        document.getElementById(outputId).innerHTML = "<ul>" +
        Object.entries(results).reduce(function(outAll,entry) {
          return suite(entry[0],Object.entries(entry[1]).reduce(function(out,e){
            if (e[1] instanceof Error) {
              return out + test(e[0],err(e[1].message,e[1].stack));
            } else {
              return out + test(e[0],"");
            }
          },outAll))
        },"") + "</ul>";
      }
    }
  });
})()
