namespace('sp.cobblestone.Download',{
  'sp.common.Utilities': 'util',
  'sp.cobblestone.CobblestoneUtil': 'cUtil'
},({ util, cUtil }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {scale:5};
      this.onClose = props.onClose();
      props.setOnOpen((context) => {
        const { images, placements } = context;
        this.repaintImage({
          images, placements,
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
        updates.images,
        updates.placements,
        (dataURL) => {
          this.setState(util.merge(updates,{ canvasURL: dataURL }));
        }
      )
    }
    render() {
      return <div className="d-flex flex-column">
        <div>
          <div className="form-group">
            <label htmlFor="imageScale">Image Scale:</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={this.state.scale}
              onChange={(e) => this.repaintImage({ scale: parseInt(e.target.value) })}
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
                this.repaintImage({ trimToImage: e.target.checked })
              }
            />
          </div>
          <p>Right-click on the image to save.</p>
          {['scale', 'width', 'height'].reduce((out, key) => {
            return out && !isNaN(this.state[key]);
          }, true) && (
            <div>
              <img
                alt="image"
                src={this.state.canvasURL}
                style={{
                  width: this.state.scale * this.state.width,
                  height: this.state.scale * this.state.height,
                  border: '1px solid black',
                }}
              />
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