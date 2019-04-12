(function(){
  var coord = function(x,y) {
    return y + "x" + x;
  }
  var parse = function(c) {
    var yx = c.split("x").map(function(n){
      return parseInt(n);
    });
    return {
      x:yx[1],
      y:yx[0]
    };
  }
  var newPage = function() {
    var page = {};
    for(var x = 0; x < 8; x++) {
      for(var y = 0; y < 10; y++) {
        page[coord(x,y)] = true;
      }
    }
    return page;
  }
  var findOnPage = function(page,size) {
    var keys = Object.keys(page);
    keys.sort();
    var first = parse(keys[0]);
    
  }
  registry.apply("RoundPeg",[
  ],function(){
    return function() {
      this.paginate = function(counts) {
        var pages = [];
        var pegs = [];
        ["4","3","2","1"].forEach(function(size) {
          var count = counts[size];
          for(var i = 0; i < count; i++) {
            var page = 0;
            var peg = -1;
            while(peg < 0) {
              if (page >= pages.length) {
                pages.push(newPage());
              }
              var coord = findOnPage(pages[page],parseInt(size));
              if (coord) {
                peg = page;
                while (peg>=pegs.length) {
                  pegs.push({});
                }
                pegs[peg][size] = pegs[peg][size] || [];
                pegs[peg][size].push(coord);
              }
            }
          }
        });
        return pegs;
      }
    }
  });
})()
