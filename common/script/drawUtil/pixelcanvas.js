(function() {
  window[registryName].apply('PixelCanvas', ['Point', 'Transformer','GridTransformer'], function(Point,Transformer,GridTransformer) {
    return function(instanceName,svgId,initWidth,initHeight,pixelSize) {
      var gridTf = new GridTransformer(initWidth,initHeight);
      var state = {
        grid:{},
        width:initWidth,
        height:initHeight
      };
      var gridKey = function(x,y) {
        return (new Point(x,y)) + "";
      }
      var copyGrid = function(grid) {
        return Object.entries(grid).reduce(function(out,entry) {
          out[entry[0]] = entry[1];
          return out;
        },{});
      }
      this.init = function(palette) {
        state.svg = document.getElementById(svgId);
        this.redraw(palette);
      }
      this.setSize = function(width,height) {
        state.width = width;
        state.height = height;
        gridTf.dim(width,height);
      }
      this.redraw = function(palette) {
        if(state.svg) {
          state.svg.innerHTML = JSON.toXML({
            tag:"svg",
            attrs:{
              width:"100%",
              viewBox:[0,0,state.width * pixelSize, state.height * pixelSize].join(" "),
              preserveAspectRatio:"xMaxYMax meet"
            },
            content:[{
              tag:"defs",
              content:palette.map(function(color,index){
                return {
                  tag:"rect",
                  attrs:{
                    width:pixelSize,
                    height:pixelSize,
                    stroke:"black",
                    "stroke-width":1,
                    fill:color,
                    id:"palette" + index
                  }
                }
              })
            }].concat(Number.range(state.height).reduce(function(out,y){
              return out.concat(Number.range(state.width).map(function(x){
                var color = state.grid[gridKey(x,y)] || 0;
                return {
                  tag:"use",
                  attrs:{
                    x:x * pixelSize,
                    y:y * pixelSize,
                    href:"#palette" + color,
                    onClick:instanceName + ".setColor(" + x + "," + y + ")"
                  }
                };
              }));
            },[]))
          })
        }
      }
      
      this.transform = function(tfType) {
        state.grid = gridTf.transformGrid(tfType,state.grid);
      }
      
      this.applyGrid = function(grid) {
        state.grid = copyGrid(grid);
      }
      this.setColor = function(x,y,color) {
        if (color == 0) {
          delete state.grid[gridKey(x,y)];
        } else {
          state.grid[gridKey(x,y)] = color;
        }
      }
      this.removeColor = function(color) {
        Object.entries(state.grid).forEach(function(pixel){
          if (pixel[1] == color) {
            delete state.grid[pixel[0]];
          } else if (pixel[1] > color) {
            state.grid[pixel[0]] = pixel[1] - 1;
          }
        });
      }
      this.getGrid = function() {
        return copyGrid(state.grid);
      }
      this.getWidth = function() {
        return state.width;
      }
      this.getHeight = function() {
        return state.height;
      }
    }
  });
})()