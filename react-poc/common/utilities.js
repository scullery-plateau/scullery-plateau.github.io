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
  return {
    range,
    merge,
    getForegroundColor,
    hexFromRGB,
    rgbFromHex,
    normalizeFilename,
    triggerJSONDownload,
    buildImmutable
  };
});
