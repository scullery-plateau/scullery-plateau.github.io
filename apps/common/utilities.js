namespace('sp.common.Utilities', () => {
  const range = function (size) {
    return Array(size)
      .fill('')
      .map((e, i) => i);
  };
  const merge = function () {
    return Array.from(arguments).reduce((acc, map) => {
      return Object.entries(map).reduce((out, [k, v]) => {
        out[k] = v;
        return out;
      }, acc);
    }, {});
  };
  const partition = function (myArray, partitionSize) {
    const incoming = Array.from(myArray);
    const partitions = [];
    while (incoming.length > 0) {
      partitions.push(incoming.splice(0, partitionSize));
    }
    return partitions;
  };
  const rgbFromHex = function (hex) {
    if (typeof hex === 'string') {
      const [red, green, blue] = [1, 3, 5].map((i) =>
        parseInt(hex.substr(i, 2), 16)
      );
      return { red, green, blue };
    }
  };
  const getForegroundColor = function (hex) {
    const rgb = rgbFromHex(hex);
    const luminosity = Math.sqrt(
      Math.pow(rgb['red'], 2) * 0.299 +
        Math.pow(rgb['green'], 2) * 0.587 +
        Math.pow(rgb['blue'], 2) * 0.114
    );
    return luminosity > 186 ? 'black' : 'white';
  };
  const hexFromRGB = function (r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((c) => {
          let h = Number(c).toString(16);
          if (h.length === 1) {
            h = '0' + h;
          }
          return h;
        })
        .join('')
    );
  };
  const normalizeFilename = function (filename, ext, defaultFilename) {
    filename = filename || defaultFilename;
    if (filename.endsWith(ext)) {
      filename = filename.replace(ext, '');
    }
    filename = encodeURIComponent(filename);
    if (filename.length === 0) {
      return defaultFilename;
    }
    return filename + ext;
  };
  const triggerJSONDownload = function (fileName, defaultFilename, jsonData) {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(jsonData));
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.setAttribute('href', dataStr);
    link.setAttribute(
      'download',
      normalizeFilename(fileName, '.json', defaultFilename)
    );
    link.click();
    document.body.removeChild(link);
  };
  const buildImmutable = function (obj) {
    return Object.entries(obj).reduce((out, [k, v]) => {
      out[k] = () => v;
      return out;
    }, {});
  }
  const calcTrimBounds = function (
    trimToImage,
    width,
    height,
    keys,
    parseIdFn
  ) {
    let [offsetX, offsetY] = [0, 0];
    if (trimToImage) {
      const { xs, ys } = keys.reduce(
        (acc, k) => {
          let { x, y } = parseIdFn(k);
          acc.xs.push(x);
          acc.ys.push(y);
          return acc;
        },
        { xs: [], ys: [] }
      );
      const [minX, minY] = [xs, ys].map((ns) => Math.min.apply(null, ns));
      const [maxX, maxY] = [xs, ys].map((ns) => Math.max.apply(null, ns));
      [offsetX, offsetY, width, height] = [
        minX,
        minY,
        maxX + 1 - minX,
        maxY + 1 - minY,
      ];
    }
    return { offsetX, offsetY, width, height };
  };
  return {
    range,
    merge,
    getForegroundColor,
    hexFromRGB,
    rgbFromHex,
    normalizeFilename,
    triggerJSONDownload,
    buildImmutable,
    partition,
    calcTrimBounds
  };
});
