(function () {
  let toRadians = (degrees) => (degrees * Math.PI) / 180;
  let transforms = {
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
  let getCoordinateId = function (x, y) {
    return [x, y].map((i) => i.toString(16).toUpperCase()).join('x');
  };
  let drawImage = function (ctx, dataURL, tileDim, x, y, tf) {
    let img = document.createElement('img');
    img.onload = () => {
      ctx.save();
      transforms[tf](ctx, img, tileDim, x, y);
      ctx.restore();
    };
    img.src = dataURL;
  };
  window.drawCanvas = function (
    canvasId,
    tileDim,
    width,
    height,
    images,
    placements
  ) {
    let canvasWrapper = document.getElementById(canvasId);
    canvasWrapper.innerHTML = '';
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', width * tileDim);
    canvas.setAttribute('height', height * tileDim);
    canvasWrapper.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let coordId = getCoordinateId(x, y);
        let [filename, tf] = placements[coordId];
        let dataURL = images[filename];
        drawImage(ctx, dataURL, tileDim, x, y, tf);
      }
    }
  };
})();
