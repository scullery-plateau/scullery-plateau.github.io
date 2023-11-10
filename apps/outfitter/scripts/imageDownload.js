namespace('sp.outfitter.ImageDownload', {
  'sp.common.Utilities': 'Utilities',
  'sp.outfitter.OutfitterUtil': 'oUtil'
}, ({ Utilities, oUtil }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.close = props.close;
      props.setOnOpen(({ defaultFilename, svgData }) => {
        const { width, height } = svgData;
        oUtil.convertSVGtoBase64(svgData, (canvasURL) => {
          this.setState({ canvasURL });
        });
        this.setState({ defaultFilename, placeholder: defaultFilename, width, height });
      });
    }
    render() {
      return <>
        <p>Feel free to enter a filename</p>
        {this.state.canvasURL &&
          <div className="form-group">
            <label className="text-light form-label" htmlFor="imageDownloadFilename">
              Filename
            </label>
            <input
              type="text"
              className="form-control rpg-textbox"
              id="imageDownloadFilename"
              placeholder={this.state.placeholder}
              value={this.state.filename}
              style={{ width: "15em" }}
              onChange={(e) => this.setState({ filename: e.target.value })}/>
          </div>}
        {this.state.canvasURL && <img src={this.state.canvasURL} />}
        <div className="justify-content-end">
          {this.state.canvasURL &&
            <button
              className="btn btn-info"
              onClick={() => {
                Utilities.triggerPNGDownload(this.state.filename, this.state.defaultFilename, this.state.canvasURL);
                this.close();
              }}>Download & Close</button>}
          <button className="btn btn-danger" onClick={() => { this.close(); }}>Close</button>
        </div>
      </>;
    }
  }
});