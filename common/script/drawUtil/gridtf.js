(function() {
    window[registryName].apply('GridTransformer',['Point','Transformer'],function(Point,Transformer) {
      return function(width,height) {
        var state = {
          width:width,
          height:height
        };
        this.dim = function(width,height) {
          state.width = width;
          state.height = height;
        }
        this.transformGrid = function(tfType,grid) {
          if (state.width != state.height) {
            throw {
              message:"Grid width and height are not equal, and must be to perform transformations.",
              width:width,
              height:height
            };
          }
          var tf = new Transformer(state.width)[tfType];
          return Object.entries(grid).reduce(function(out,entry) {
            var point = tf(Point.parse(entry[0]));
            out[point + ""] = entry[1];
            return out;
          },{});
        }
      }
    });
})();