namespace("sp.spritely-harvester.SpritelyHarvester", {
  'sp.common.Utilities':'util',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Header': 'Header'
}, ({}) => {
  const Thumbnail = function(props) {
    <div className="thumbnail rpg-box d-flex flex-column">
      <span className="align-self-center">{props.label}</span>
      <div
        className="frame align-self-center"
        style={{ backgroundImage: `url(${props.dataURL})` }}
      ></div>
    </div>
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.menuItems = [];
    }
    loadImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL, filename) => {
          util.initImageObj(dataURL,(baseImg) => {
            this.setState({ original: { dataURL, baseImg }, filename:filename.split(".")[0] });
          });
        },
        (filename, error) => {
          console.log({filename, error});
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    updateDim(updates) {
      // todo
    }
    refinePalette() {
      // todo
    }
    render() {
      return <>
        <Header menuItems={this.menuItems} appTitle={'Spritely Harvester'} />
        { this.state.original ? <>
          <h1 className="text-center">{this.state.filename}</h1>
          <div className="d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center">
              <div className="">
                <label for="coreDim" className="form-label">Select Dimentions from Spritely Defaults:</label>
                <select id="coreDim" className="form-select" onChange={(e) => {
                  const dim = e.target.value;
                  this.updateDim({ rows: dim, columns: dim });
                }}>
                  <option value="16">16</option>
                  <option value="32">32</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="">
                <label for="rows" className="form-label">Rows</label>
                <input type="number" id="rows" class="form-control" value={this.state.rows || 0} onChange={(e) => this.updateDim({ rows: e.target.value })}/>
              </div>
              <div className="">
                <label for="columns" class="form-label">Columns</label>
                <input type="number" id="columns" class="form-control"  value={this.state.columns || 0} onChange={(e) => this.updateDim({ columns: e.target.value })}/>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="">
                <button className="btn btn-primary" onClick={() => this.refinePalette()}>Refine Palette</button>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-3">
                <Thumbnail label="Original" dataURL={this.state.original.dataURL}></Thumbnail>
              </div>
              { this.state.initial && <div className="col-3">
                <Thumbnail label="Initial" dataURL={this.state.initial.dataURL}></Thumbnail>
              </div>}
              { (this.state.refinements || []).map((refinement, i) => <div className="col-3">
                <Thumbnail label={`Refinement ${i + 1}`} dataURL={refinement.dataURL}></Thumbnail>
              </div>)}
            </div>
          </div>
        </> : <>
          <p>Click the button below to choose an image to convert to a Spritely pixel file.</p>
          <button className="btn btn-success text-center" onClick={() => this.loadImage()}>Load Image</button>
        </>}
      </>;
    }
  }
});