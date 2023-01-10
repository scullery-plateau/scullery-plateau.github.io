namespace(
  'sp.spritely.ImageDownload',
  { 
    'sp.common.Utilities': 'Utilities', 
    'sp.spritely.Constants': 'Constants', 
    'sp.spritely.SpritelyUtil': 'SpritelyUtil', 
  },
  ({ Utilities, Constants, SpritelyUtil }) => {
    const triggerSpritelyDownload = function (
      fileName,
      { pixels, palette, size, bgColor, isTransparent }
    ) {
      const jsonData = { pixels, palette, size };
      if (!isTransparent) {
        jsonData.bgColor = bgColor;
      }
      Utilities.triggerJSONDownload(
        fileName,
        Constants.defaultFilename,
        jsonData
      );
    };
    const drawRect = function (ctx, color, coords) {
      ctx.fillStyle = color;
      ctx.fillRect.apply(ctx, coords);
    };
    const drawImageInCanvas = function (data, scale, imgDim, trimToImage) {
      let { offsetX, offsetY, width, height } = Utilities.calcTrimBounds(
        trimToImage,
        data.size,
        data.size,
        Object.keys(data.pixels),
        SpritelyUtil.parsePixelId
      );
      const canvasElem = document.createElement('canvas');
      canvasElem.setAttribute('width', (width * scale).toString());
      canvasElem.setAttribute('height', (height * scale).toString());
      canvasElem.setAttribute('style', 'border: 1px solid black');
      const ctx = canvasElem.getContext('2d');
      if (!data.isTransparent) {
        const coords = [0, 0, imgDim, imgDim];
        drawRect(ctx, data.bgColor, coords);
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelId = SpritelyUtil.getPixelId(x + offsetX, y + offsetY);
          if (pixelId in data.pixels) {
            const coords = [scale * x, scale * y, scale, scale];
            drawRect(ctx, data.palette[data.pixels[pixelId]], coords);
          }
        }
      }
      const dataURL = canvasElem.toDataURL('image/png');
      return { dataURL, width, height, canvasElem };
    };
    const repaintImage = function (me, update) {
      const newState = Utilities.merge(me.state, update);
      const imgDim = me.appState.size * newState.scale;
      const download = Utilities.normalizeFilename(
        newState.filename,
        '.png',
        Constants.defaultFilename
      );
      const moreUpdates = drawImageInCanvas(
        me.appState,
        newState.scale,
        imgDim,
        newState.trimToImage
      );
      me.setState(Utilities.merge(newState, moreUpdates, { download }));
    };
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          dataURL: '',
          filename: Constants.defaultFilename(),
          scale: 5,
          trimToImage: false,
        };
        props.setOnOpen(({ pixels, palette, size, bgColor, isTransparent }) => {
          this.appState = { pixels, palette, size, bgColor, isTransparent };
          repaintImage(this, { width: size, height: size });
        });
        this.onClose = props.onClose;
      }
      render() {
        return (
          <div>
            <div className="form-group">
              <label htmlFor="imageFileName">File Name:</label>
              <input
                type="text"
                className="form-control"
                value={this.state.filename}
                onChange={(e) =>
                  repaintImage(this, { filename: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageScale">Image Scale:</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={this.state.scale}
                onChange={(e) => repaintImage(this, { scale: e.target.value })}
              />
            </div>
            <div className="form-check">
              <label htmlFor="trimToImage" className="form-check-label">
                Trim To Image?
              </label>
              <input
                type="checkbox"
                className="form-check-input"
                checked={this.state.trimToImage}
                onChange={(e) =>
                  repaintImage(this, { trimToImage: e.target.checked })
                }
              />
            </div>
            <p>Click on the image to download.</p>
            {['scale', 'width', 'height'].reduce((out, key) => {
              return out && !isNaN(this.state[key]);
            }, true) && (
              <div>
                <a
                  href={this.state.dataURL}
                  title="click image to download"
                  download={this.state.download}
                >
                  <img
                    alt="image"
                    src={this.state.dataURL}
                    style={{
                      width: this.state.scale * this.state.width,
                      height: this.state.scale * this.state.height,
                      border: '1px solid black',
                    }}
                  />
                </a>
              </div>
            )}
            <div>
              <button
                className={'btn btn-success'}
                onClick={() => {
                  triggerSpritelyDownload(this.state.filename, this.appState);
                  this.onClose();
                }}
              >
                Download
              </button>
              <button
                className={'btn btn-danger'}
                onClick={() => this.onClose()}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      }
    };
  }
);
