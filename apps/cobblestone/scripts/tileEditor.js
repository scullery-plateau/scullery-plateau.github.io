namespace("sp.cobblestone.TileEditor",{
  "sp.cobblestone.CobblestoneUtil": 'cUtil'
},({ cUtil }) => {
  const tileEditorHelp = 'Click on the variation of the given tile shown below to include (green) or exclude (red) them in the main app.';
  const tileDim = cUtil.getTileDim();
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {tiles:{}};
      this.onClose = props.onClose;
      props.setOnOpen(({filename,dataURL,tiles}) => {
        this.setState({filename,dataURL,tiles:this.copyTiles(tiles)});
      });
    }
    copyTiles(tiles) {
      return Object.entries(tiles).reduce(
        (out, [transform, isChecked]) => {
          out[transform] = isChecked;
          return out;
        },{})
    }
    toggleTransform(transform) {
      const tiles = this.copyTiles(this.state.tiles);
      tiles[transform] = !tiles[transform];
      this.setState({ tiles });
    }
    render() {
      const transforms = this.state.tiles;
      if (transforms) {
        return <div className="d-flex flex-column">
          <div className="d-flex flex-column">
            <svg width="0" height="0">
              <defs>
                <image id="tileToEdit" href="${this.state.dataURL}" width={tileDim} height={tileDim}/>
              </defs>
            </svg>
            <p>{tileEditorHelp}</p>
            <div className="row w-75 justify-content-center">
              {
                cUtil.mapTransformOptions((transform) => {
                  const isActive = transforms[transform];
                  const tfs = cUtil.buildImageTransform(transform);
                  return <div className="col-3">
                    <button 
                      className={`tile ${isActive ? 'active-tile' : 'inactive-tile'}`} 
                      title={transform === '' ? 'Original' : transform}
                      onClick={() => this.toggleTransform(transform)}>
                      <svg width="100%" height="100%" viewBox={`0 0 ${tileDim} ${tileDim}`}>
                        <use href="#tileToEdit" transform={tfs}/>
                      </svg>
                    </button>
                  </div>
                })
              }
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-success" onClick={() => this.onClose(this.state) }>Apply Changes</button>
            <button className="btn btn-danger" onClick={() => this.onClose() }>Cancel</button>
          </div>
        </div>;
      }
    }
  }
})