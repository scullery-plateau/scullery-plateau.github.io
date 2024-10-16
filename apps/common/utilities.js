namespace('sp.common.Utilities', {
  'sp.common.Colors':'Colors'
}, ({ Colors }) => {
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
  const selectKeys = function (obj, keys) {
    return Array.from(keys).reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
  }
  const copyObj = function (obj) {
    return selectKeys(obj, Object.keys(obj));
  }
  const assoc = function (map, key, value) {
    const out = merge(map);
    out[key] = value;
    return out;
  }
  const dissoc = function(map, keys) {
    const out = merge(map);
    Array.from(keys).forEach(key => {
      delete out[key];
    });
    return out;
  }
  const getIn = function(obj,keys,defaultValue) {
    if (keys.length <= 0) {
      return obj || defaultValue;
    }
    return getIn(obj[keys[0]],keys.slice(1),defaultValue);
  }
  const updateIn = function(obj,keys,value) {
    if (keys.length > 1) {
      obj[keys[0]] = updateIn(obj[keys[0]],keys.slice(1),value);
    } else if (keys.length === 1) {
      obj[keys[0]] = value;
    }
    if (Array.isArray(obj)) {
      return Array.from(obj);
    } else {
      return merge(obj);
    }
  }
  const toggleIn = function(obj,keys) {
    if (keys.length > 1) {
      obj[keys[0]] = toggleIn(obj[keys[0]],keys.slice(1));
    } else if (keys.length === 1) {
      if (obj[keys[0]]) {
        delete obj[keys[0]];
      } else {
        obj[keys[0]] = true;
      }
    }
    if (Array.isArray(obj)) {
      return Array.from(obj);
    } else {
      return merge(obj);
    }
  }
  const partition = function (myArray, partitionSize) {
    const incoming = Array.from(myArray);
    const partitions = [];
    while (incoming.length > 0) {
      partitions.push(incoming.splice(0, partitionSize));
    }
    return partitions;
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
  const triggerPNGDownload = function (fileName, defaultFilename, imageURL) {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.setAttribute('href', imageURL);
    link.setAttribute(
      'download',
      normalizeFilename(fileName, '.png', defaultFilename));
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
  const getCanvasAndContext = function(domId) {
    const canvas = document.getElementById(domId);
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  }
  const drawCanvasURL = function(domIdOrCallback,callback) {
    if (typeof domIdOrCallback === 'function') {
      callback = domIdOrCallback;
      domIdOrCallback = undefined;
    }
    const canvas = domIdOrCallback?document.getElementById(domIdOrCallback):document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    callback(canvas,ctx);
    return canvas.toDataURL();
  }
  const drawImageInCanvas = function(baseImg,xOffset,yOffset,frameWidth,frameHeight,domId) {
    return drawCanvasURL(domId,(canvas,ctx) => {
      canvas.width = frameWidth;
      canvas.height = frameHeight;
      ctx.drawImage(baseImg,-xOffset,-yOffset,baseImg.width,baseImg.height);
    })
  }
  const buildNumberInputGroup = function(inputId, inputLabel, opts, getter, setter) {
    return <div className="input-group">
      <label htmlFor={inputId} className="input-group-text">{inputLabel}</label>
      <input
        id={inputId}
        type="number"
        className="form-control"
        min={opts.min}
        max={opts.max}
        step={opts.step || 1}
        style={opts.style || {}}
        value={ getter() }
        onChange={(e) => setter(e.target.value)}
      />
    </div>;
  }
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const initImageObj = function(url,callback) {
    const baseImg = new Image();
    baseImg.onload = (() => {
      callback(baseImg);
    });
    baseImg.src = url;
  }
  return {
    range,
    merge,
    assoc,
    dissoc,
    selectKeys,
    copyObj,
    normalizeFilename,
    triggerJSONDownload,
    triggerPNGDownload,
    buildImmutable,
    partition,
    calcTrimBounds,
    getCanvasAndContext,
    getIn,
    updateIn,
    toggleIn,
    buildNumberInputGroup,
    toRadians,
    initImageObj,
    drawCanvasURL,
    drawImageInCanvas
  };
});
