(function(){
  registry.apply("HexAtlas",[
  ],function(){
    return function(fileLoaderId,galleryId,printerId) {
      var ui = {
        fileLoader:document.getElementById(fileLoaderId),
        gallery:document.getElementById(galleryId),
        printer:document.getElementById(printerId)
      }
      this.loadFile = function() {
        
      }
    }
  });
})();
