(function(){
  registry.apply("FileParser",[
  ],function(){
    return function(){
      this.parse = function(fileData) {
        return {
          tiles:{},
          palettes:{},
          map:{}
        };
      }
    };
  });
})();
