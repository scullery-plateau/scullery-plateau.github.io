(function () {
  let XY = function ([x, y]) {
    this.toJSON = function () {
      return [x, y];
    };
    this.plus = function ([px, py]) {
      return new XY([x + px, y + py]);
    };
    this.minus = function ([px, py]) {
      return new XY([x - px, y - py]);
    };
    this.times = function ([px, py]) {
      return new XY([x * px, y * py]);
    };
    this.min = function ([px, py]) {
      return new XY([Math.min(x, px), Math.min(y, py)]);
    };
    this.max = function ([px, py]) {
      return new XY([Math.max(x, px), Math.max(y, py)]);
    };
    this.toString = function () {
      return `(${x},${y})`;
    };
  };
  XY.identityMultiplier = function () {
    return new XY([1, 1]);
  };
  XY.origin = function () {
    return new XY([0, 0]);
  };
  window.XY = XY;
})();
