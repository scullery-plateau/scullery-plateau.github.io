namespace('sp.grid-cropper.ImageDownload', {
  'sp.common.Utilities': 'util'
}, ({ util }) => {
  const convertSVGtoBase64 = function({ baseImg, gridRows, gridColumns, squareSize, marginTop, marginLeft, isTransparent, bgColor, includeGrid, gridLineWidth, gridLineColor }) {
    const c = document.getElementById("canvas");
    const ctx = c.getContext('2d');
    const [ width, height ] = [ gridColumns, gridRows ].map(g => g * squareSize);
    c.width = width;
    c.height = height;
    if (bgColor && !isTransparent) {
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.drawImage(baseImg, -marginLeft, -marginTop, baseImg.width, baseImg.height);
    if (includeGrid && gridLineColor && (gridLineWidth >= 1)) {
      ctx.lineWidth = gridLineWidth;
      ctx.strokeStyle = gridLineColor;
      Array(gridRows).fill("").forEach((_, rowIndex) => {
        Array(gridColumns).fill("").forEach((_, columnIndex) => {
          ctx.beginPath();
          ctx.rect(columnIndex * squareSize, rowIndex * squareSize, squareSize, squareSize);
          ctx.closePath();
          ctx.stroke();
        });
      });
    }
    return c.toDataURL();
  }
  const update = function(state,field,value) {
    state[field] = value;
    state.canvasURL = convertSVGtoBase64(state);
    return state;
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.close = props.close;
      props.setOnOpen((input) => {
        const { defaultFilename, cropData: { 
          baseImg, gridRows, gridColumns, squareSize, marginTop, marginLeft, 
          isTransparent, bgColor, includeGrid, gridLineWidth, gridLineColor 
        } } = input;
        this.setState(update({
          baseImg, gridRows, gridColumns, squareSize, marginTop, marginLeft, 
          isTransparent, bgColor, includeGrid, gridLineWidth, gridLineColor,
          defaultFilename
        }, "placeholder", defaultFilename));
      });
    }
    update(field,value) {
      this.setState(update(this.state,field,value));
    }
    render() {
      return (<>
        <p>Feel free to enter a filename</p>
        { this.state.canvasURL &&
          <div className="d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center flex-wrap">
              <button
                  className={`rounded w-25 btn ${this.state.isTransparent ? 'btn-outline-light' : 'btn-dark'}`}
                  onClick={() => { this.update("isTransparent", !this.state.isTransparent) }}
                >{this.state.isTransparent ? 'Transparent' : 'Opaque'}</button>
              <button
                  className={`rounded w-25 btn ${!this.state.includeGrid ? 'btn-outline-light' : 'btn-dark'}`}
                  onClick={() => { this.update("includeGrid", !this.state.includeGrid) }}
                >{this.state.includeGrid ? 'Show Grid' : 'Hide Grid'}</button>
            </div>
            <img className="grid-cropper-preview" src={this.state.canvasURL} />
            <div className="form-group">
              <label className="text-light form-label" htmlFor="imageDownloadFilename">
                Filename
              </label>
              <input
                type="text"
                className="form-control rpg-textbox"
                id="imageDownloadFilename"
                name="imageDownloadFilename"
                placeholder={this.state.placeholder}
                value={this.state.filename}
                style={{ width: "15em" }}
                onChange={(e) => this.setState({ filename: e.target.value })}/>
            </div>
          </div> }
        <div className="justify-content-end">
          { this.state.canvasURL &&
            <button
              className="btn btn-info"
              onClick={() => {
                util.triggerPNGDownload(this.state.filename, this.state.defaultFilename, this.state.canvasURL);
                this.close();
              }}>Download&nbsp;&amp;&nbsp;Close</button> }
          <button className="btn btn-danger" onClick={ () => { this.close() } }>Close</button>
        </div>
      </>);
    }
  }
});