namespace("sp.cobblestone.CobblestoneUtil",{
  'sp.common.Utilities': 'util',
  'sp.common.GridUtilities': 'gUtil'
},({ util, gUtil }) => {
  const tileDim = 30
  const getTileDim = (() => tileDim);
  const getTileId = ((filename, tf) => [filename].concat(tf.split(',')).join('.'));
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
  const canvasTransforms = {
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
      ctx.rotate(util.toRadians(-90));
      ctx.translate(-tileDim, 0);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    turnRight: (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(util.toRadians(90));
      ctx.translate(0, -tileDim);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    'flipDown,flipOver': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(util.toRadians(180));
      ctx.translate(-tileDim, -tileDim);
      ctx.drawImage(img, 0, 0, tileDim, tileDim);
    },
    'flipOver,turnLeft': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(util.toRadians(-90));
      ctx.scale(1, -1);
      ctx.translate(-tileDim, 0);
      ctx.drawImage(img, 0, 0, tileDim, -1 * tileDim);
    },
    'flipOver,turnRight': (ctx, img, tileDim, x, y) => {
      ctx.translate(x * tileDim, y * tileDim);
      ctx.rotate(util.toRadians(90));
      ctx.scale(1, -1);
      ctx.translate(0, tileDim);
      ctx.drawImage(img, 0, 0, tileDim, -1 * tileDim);
    },
  };
  const getTileTransform = ((tf) => tileTransforms[tf]);
  const buildImageTransform = ((tf) => tf.split(',').map((t) => getTileTransform(t)).join(' '));
  const mapTransformOptions = ((cb) => transformOptions.map(cb));
  const transformCanvas = ((tf, ctx, img, tileDim, x, y) => canvasTransforms[tf](ctx, img, tileDim, x, y))
  const drawImage = function (ctx, dataURL, tileDim, x, y, tf, state, callback) {
    const img = document.createElement('img');
    img.onload = () => {
      ctx.save();
      transformCanvas(tf,ctx, img, tileDim, x, y);
      ctx.restore();
      delete state[gUtil.getCoordinateId(x, y)];
      if (Object.keys(state).length === 0) {
        callback();
      }
    };
    img.src = dataURL;
  };
  const drawCanvas = function(trimToImage, tileDim, w, h, images, placements, onCompleteFn) {
    let { offsetX, offsetY, width, height } = util.calcTrimBounds(
      trimToImage,
      w,
      h,
      Object.keys(placements),
      gUtil.parseCoordinateId
    );
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width * tileDim);
    canvas.setAttribute('height', height * tileDim);
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const state = {};
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const coordId = gUtil.getCoordinateId(x, y);
        const placement = placements[coordId];
        if (placement) {
          state[coordId] = true;
          const [filename, tf] = placement;
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
    }
  };
  return { getTileDim, getTileTransform, buildImageTransform, mapTransformOptions, transformCanvas, drawImage, drawCanvas, getTileId };
});