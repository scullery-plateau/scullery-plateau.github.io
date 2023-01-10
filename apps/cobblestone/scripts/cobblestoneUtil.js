namespace("sp.cobblestone.CobblestoneUtil",{
  'sp.common.Utilities': 'util',
},({ util }) => {
  const radix = 32;
  const getCoordinateId = ((x, y) => [x, y].map((i) => i.toString(radix).toUpperCase()).join('x'));
  const parseCoordinateId = function (id) {
    const [x, y] = id.split('x').map((n) => parseInt(n, radix));
    return { x, y };
  };
  const tileDim = 30
  const getTileDim = (() => tileDim);
  const getEmptyCellId = (() => 'emptyCell');
  const tileTransforms = {
    flipDown: `matrix(1 0 0 -1 0 ${tileDim})`,
    flipOver: `matrix(-1 0 0 1 ${tileDim} 0)`,
    turnLeft: `rotate(-90,${tileDim / 2},${tileDim / 2})`,
    turnRight: `rotate(90,${tileDim / 2},${tileDim / 2})`,
  };
  const transformOptions = [
    '',
    'flipDown',
    'flipOver',
    'turnLeft',
    'turnRight',
    'flipDown,flipOver',
    'flipOver,turnLeft',
    'flipOver,turnRight',
  ];
  let canvasTransforms = {
    '': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    flipDown: (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, tileDim, -1 * tileDim);
    },
    flipOver: (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.scale(-1, 1);
      ctx.translate(-tileDim, tileDim);
      ctx.drawImage(img, 0, 0, tileDim, -1 * tileDim);
    },
    turnLeft: (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(toRadians(-90));
      ctx.translate(-tileDim, 0);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    turnRight: (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(toRadians(90));
      ctx.translate(0, -tileDim);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    'flipDown,flipOver': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(toRadians(180));
      ctx.translate(-tileDim, -tileDim);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    'flipOver,turnLeft': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(toRadians(-90));
      ctx.scale(1, -1);
      ctx.translate(-tileDim, 0);
      ctx.drawImage(img, 0, 0, tileDim, -1 * tileDim);
    },
    'flipOver,turnRight': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(toRadians(90));
      ctx.scale(1, -1);
      ctx.translate(0, tileDim);
      ctx.drawImage(img, 0, 0, tileDim, -1 * tileDim);
    },
  };
  const getTileTransform = ((tf) => tileTransforms[tf]);
  const buildImageTransform = ((tf) => tf.split(',').map((t) => getTileTransform(t)).join(' '));
  const mapTransformOptions = ((cb) => transformOptions.map(cb));
  const transformCanvas = ((tf, ctx, img, tileDim, x, y) => canvasTransforms[tf](ctx, img, tileDim, x, y))
  const getWidth = ((size, orientation) => (orientation === 'portrait')?size.min:size.max);
  const getHeight = ((size, orientation) => (orientation === 'portrait')?size.max:size.min);
  const drawImage = function (ctx, dataURL, tileDim, x, y, tf, state, callback) {
    const img = document.createElement('img');
    img.onload = () => {
      ctx.save();
      transformCanvas(tf,ctx, img, tileDim, x, y);
      ctx.restore();
      delete state[getCoordinateId(x, y)];
      console.log(`remaining coords: ${Object.entries(state).length}`);
      if (Object.keys(state).length === 0) {
        console.log('calling callback');
        callback();
      }
    };
    img.src = dataURL;
  };
  const drawCanvas = function(
    trimToImage,
    tileDim,
    width,
    height,
    images,
    placements,
    onCompleteFn) {
    const { offsetX, offsetY, width, height } = util.calcTrimBounds(
      trimToImage,
      width,
      height,
      Object.keys(placements),
      parseCoordinateId
    );
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width * tileDim);
    canvas.setAttribute('height', height * tileDim);
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const state = {};
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const coordId = getCoordinateId(x, y);
        state[coordId] = true;
        const [filename, tf] = placements[coordId];
        const dataURL = images[filename];
        drawImage(
          ctx,
          dataURL,
          tileDim,
          x - offsetX,
          y - offsetY,
          tf,
          state,
          () => {
            onCompleteFn(canvas.toDataURL());
            document.body.removeChild(canvas);
          }
        );
      }
    }
  };
  return { getCoordinateId, parseCoordinateId, getTileDim, getEmptyCellId, getTileTransform, getWidth, getHeight,
    buildImageTransform, mapTransformOptions, transformCanvas, drawImage, drawCanvas
  };
});