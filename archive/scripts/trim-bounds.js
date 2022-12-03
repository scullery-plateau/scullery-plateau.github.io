(function () {
  window.calcTrimBounds = function (
    trimToImage,
    width,
    height,
    keys,
    parseIdFn
  ) {
    let [offsetX, offsetY] = [0, 0];
    if (trimToImage) {
      let { xs, ys } = keys.reduce(
        (acc, k) => {
          let { x, y } = parseIdFn(k);
          acc.xs.push(x);
          acc.ys.push(y);
          return acc;
        },
        { xs: [], ys: [] }
      );
      let [minX, minY] = [xs, ys].map((ns) =>
        ns.reduce((a, b) => Math.min(a, b), 0)
      );
      let maxX = xs.reduce((a, b) => Math.max(a, b), width - 1);
      let maxY = ys.reduce((a, b) => Math.max(a, b), height - 1);
      [offsetX, offsetY, width, height] = [
        minX,
        minY,
        maxX + 1 - minX,
        maxY + 1 - minY,
      ];
    }
    return { offsetX, offsetY, width, height };
  };
})();
