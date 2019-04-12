(function(){
  var template = function(width,height,fill,points) {
    return `
<svg width="${width}" height="${height}">
  <polygon points="${points.join(' ')}" fill="${fill}" stroke="black" stroke-width="1"/>
</svg>
    `;
  }
  var frame = function(width,height,grid) {
    return `<svg width="${width*10}" height="${height*10}">${grid}</svg>`;
  }
  var block = function(x,y,isFilled) {
    return `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="${isFilled?'black':'white'}" stroke="black" stroke-width="1"/>`;
  }
  var coord = function(x,y) {
    return x + "x" + y;
  }
  var clearAdjacent = function(points,point,adjacent) {
    Object.keys(adjacent).forEach(function(key) {
      if (points[key]) {
        delete points[key][point];
      }
    })
  }
  var makePoints = function(width,height,count) {
    var points = {};
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var adjacent = {};
        if(x>=1) {
          adjacent[coord(x-1,y)] = true;
        }
        if(x<width-1) {
          adjacent[coord(x+1,y)] = true;
        }
        if(y>=1) {
          adjacent[coord(x,y-1)] = true;
        }
        if(y<height-1) {
          adjacent[coord(x,y+1)] = true;
        }
        points[coord(x,y)] = adjacent;
      }
    }
    console.log(points);
    var per = count * points.length / 100;
    var blocks = {};
    var shiftNext = function(availableKeys) {
      var index = Math.floor(Math.random() * availableKeys.length);
      var point = points[index];
      delete points[index];
      blocks[index] = point;
      clearAdjacent(points,index,point);
      clearAdjacent(blocks,index,point);
    }
    shiftNext(Object.keys(points));
    while (Object.keys(points).length < per) {
      var availableKeys = [].concat.apply([],Object.values(blocks).map(function(block){
        return Object.keys(block);
      }));
      shiftNext(availableKeys);
    }
    var addBlock = function(isFilled) {
      return function(point) {
        var xy = point.split("x");
        return block(xy[0],xy[1],isFilled);
      }
    }
    return [].concat(Object.keys(points).map(addBlock(false)),
      Object.keys(blocks).map(addBlock(true))).join("");
  }
  registry.apply("ZigZag",[
  ],function(){
    return function(width,height,count,fill) {
      var grid = makePoints(width,height,count);
      this.draw = function(canvasId) {
        document.getElementById(canvasId).innerHTML = frame(width,height,grid);
      }
    }
  })
})()
