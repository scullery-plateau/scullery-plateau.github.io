(function(){
  registry.apply("MapMath",[],function() {
    var decodeLoc = function(loc) {
      var col = loc.codePointAt(0) - "A".codePointAt(0);
      var row = parseInt(loc.slice(1)) - 1;
      return {col:col,row:row};
    }
    var encodeLoc = function(row,col) {
      var rowLabel = row + 1;
      return String.fromCharCode("A".codePointAt(0) + col) + rowLabel;
    }
    var distance = function(a,b) {
      return Math.max(Math.abs(a.col-b.col),Math.abs(a.row-b.row));
    }
    var add = function(a,b) {return a + b;}
    var openWithinRange = function(loc,maxRows,maxCols,range,occupied) {
      var decoded = decodeLoc(loc);
      var minRow = Math.max(0,decoded.row-range);
      var maxRow = Math.min(maxRows,decoded.row+range);
      var rowRange = maxRow - minRow + 1;
      var minCol = Math.max(0,decoded.col-range);
      var maxCol = Math.min(maxCols,decoded.col+range);
      var colRange = maxCol - minCol + 1;
      var rows = (new Array(rowRange)).fill(minRow).map(add);
      var cols = (new Array(colRange)).fill(minCol).map(add);
      return rows.reduce(function(out,row) {
        return cols.reduce(function(list,col) {
          var space = encodeLoc(row,col);
          if (space != loc && occupied.indexOf(space) < 0) {
            list.push(space);
          }
          return list;
        }, out);
      }, []);
    }
    var openAdjacentWithinRangeOfTarget = function(loc,targets,maxRows,maxCols,range,occupied) {
      var open = openWithinRange(loc,maxRows,maxCols,range,occupied);
      return targets.reduce(function(out,m,i) {
        return openWithinRange(m,maxRows,maxCols,1,occupied).filter(function(o){
          return open.indexOf(o) >= 0;
        }).reduce(function(list,o){
          return list.concat([{
            index:i,
            open:o,
            distance:distance(decode(loc),decode(o))
          }])
        },out);
      },[]);
    }
    var targetsWithinRange = function(loc,targets,range) {
      return targets.filter(function(target){
        return distance(decode(loc),decode(target)) <= range;
      });
    }
    return {
      decodeLoc:decodeLoc,
      encodeLoc:encodeLoc,
      distance:distance,
      openWithinRange:openWithinRange,
      openAdjacentWithinRangeOfTarget:openAdjacentWithinRangeOfTarget
    }
  })
})()
