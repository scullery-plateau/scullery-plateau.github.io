if (!Number.range) {
  Number.range = function(low, high, step) {
    step = step || 1;
    if (!high) {
      high = low;
      low = 0;
    }
    var out = [];
    for (var x = low; x < high; x += step) {
      out.push(x);
    }
    return out;
  }
}