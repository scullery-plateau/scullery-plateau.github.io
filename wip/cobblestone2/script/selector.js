(function(){
  registry.apply("Selector",[
  ],function(){
    return {
      loadSelector:function(selector,list,first,forEach) {
        forEach = forEach || function(a){
          return a;
        }
        selector.innerHTML = "";
        var opt = document.createElement("option");
        opt.text = first;
        selector.add(opt);
        list.forEach(function(item) {
          var opt = document.createElement("option");
          opt.text = forEach(item);
          opt.value = item;
          selector.add(opt);
        })
      },
      selectedValue:function(selector) {
        return selector.options[selector.selectedIndex].value;
      },
      setSelectedValue:function(selector,value) {
        var index = 0;
        for(; index < selector.options.length; index++) {
          if (value == selector.options[index].value) {
            break;
          }
        }
        selector.selectedIndex = index;
      }
    };
  });
})();
