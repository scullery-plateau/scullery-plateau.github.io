namespace('sp.common.Point', () => {
    const Point = function([x,y]) {
        this.toJSON = function () {
            return [x, y];
        };
        this.plus = function ([px, py]) {
            return new Point([x + px, y + py]);
        };
        this.minus = function ([px, py]) {
            return new Point([x - px, y - py]);
        };
        this.times = function ([px, py]) {
            return new Point([x * px, y * py]);
        };
        this.min = function ([px, py]) {
            return new Point([Math.min(x, px), Math.min(y, py)]);
        };
        this.max = function ([px, py]) {
            return new Point([Math.max(x, px), Math.max(y, py)]);
        };
        this.midpoint = function(p) {
            return this.plus(p).times([0.5,0.5]);
        }
        this.toString = function () {
        return `(${x},${y})`;
        };
    }
    Point.identityMultiplier = function () {
        return new Point([1, 1]);
    };
    Point.origin = function () {
        return new Point([0, 0]);
    };
    return Point;
});