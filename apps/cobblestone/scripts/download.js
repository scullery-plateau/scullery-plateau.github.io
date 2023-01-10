namespace('sp.cobblestone.Download',{
  'sp.common.Utilities': 'util',
  'sp.cobblestone.CobblestoneUtil': 'cUtil'
},({ util, cUtil }) => {
  const defaultFilename = "cobblestone";
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.context = {}
      this.state = {scale:5,filename:defaultFilename};
      this.onClose = props.onClose();
      props.setOnOpen((context) => {
        this.context = context;
        this.repaintImage({
          width:cUtil.getWidth(context.size,context.orientation),
          height:cUtil.getHeight(context.size,context.orientation)
        });
      });
    }
    repaintImage(updates) {
      updates = util.merge(this.state,updates);
      cUtil.drawCanvas(
        updates.trimToImage,
        updates.scale,
        updates.width,
        updates.height,
        this.context.images,
        this.context.placements,
        (dataURL) => {
          this.setState(util.merge(updates,{ canvasURL: dataURL }));
        }
      )
    }
    render() {
      return <div className="d-flex flex-columns">
        <div>
          <div className="form-group">
            <label htmlFor="imageFileName">File Name:</label>
            <input
              type="text"
              className="form-control"
              value={this.state.filename}
              onChange={(e) =>
                repaintImage({ filename: e.target.value })
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
              onChange={(e) => repaintImage({ scale: e.target.value })}
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
                repaintImage({ trimToImage: e.target.checked })
              }
            />
          </div>
          <p>Click on the image to download.</p>
          {['scale', 'width', 'height'].reduce((out, key) => {
            return out && !isNaN(this.state[key]);
          }, true) && (
            <div>
              <a
                href={this.state.canvasURL}
                title="click image to download"
                download={this.state.download}
              >
                <img
                  alt="image"
                  src={this.state.canvasURL}
                  style={{
                    width: this.state.scale * this.state.width,
                    height: this.state.scale * this.state.height,
                    border: '1px solid black',
                  }}
                />
              </a>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-warning" onClick={() => { this.onClose() }}>Close</button>
        </div>
      </div>;
    }
  }
});