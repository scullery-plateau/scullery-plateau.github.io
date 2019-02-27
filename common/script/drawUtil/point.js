(function() {
  window[registryName].apply('Point',[],function() {
    var Point = function(x,y) {
      this.getX = function() {
        return x;
      }
      this.getY = function() {
        return y;
      }
      this.toString = function() {
        return x + "-" + y;
      }
      this.toJSON = function() {
        return {
          x:x,
          y:y
        }
      }
    }
    Point.parse = function(str) {
      var p = str.split("-").map((n) => parseInt(n));
      return new Point(p[0], p[1]);
    }
    return Point;
  });
  window[registryName].apply('Transformer',['Point'],function(Point) {
    return function(size) {
      var bound = size - 1;
      this["flip-down"] = ((p) => new Point(p.getX(), (bound - p.getY())));
      this["flip-over"] = ((p) => new Point((bound - p.getX()), p.getY()));
      this["turn-left"] = ((p) => new Point(p.getY(), (bound - p.getX())));
      this["turn-right"] = ((p) => new Point((bound - p.getY()), p.getX()));
      this["shift-right"] = ((p) => new Point((parseInt(p.getX()) + 1), p.getY()));
      this["shift-left"] = ((p) => new Point((p.getX() - 1), p.getY()));
      this["shift-up"] = ((p) => new Point(p.getX(), (p.getY() - 1)));
      this["shift-down"] = ((p) => new Point(p.getX(), (parseInt(p.getY()) + 1)));
    }
  });
})()