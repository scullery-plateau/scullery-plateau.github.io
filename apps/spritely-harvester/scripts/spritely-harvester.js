namespace("sp.spritely-harvester.SpritelyHarvester", {
  'sp.common.Utilities':'util',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Header': 'Header',
  'sp.spritely-harvester.HarvesterUtils': "HarvesterUtils",
  'sp.spritely-harvester.SpritelyDisplay': "SpritelyDisplay",
}, ({ util, LoadFile, Header, HarvesterUtils, SpritelyDisplay }) => {
  const sizes = [16,32,48];
  const Thumbnail = function(props) {
    <div className="thumbnail rpg-box d-flex flex-column">
      <span className="align-self-center">{props.label}</span>
      <div
        className="frame align-self-center"
        style={{ backgroundImage: `url(${props.dataURL})` }}
      ></div>
    </div>
  }
  const Refinement = function(props) {
    <div className="thumbnail rpg-box d-flex flex-column">
      <span className="align-self-center">Refinement {props.index}</span>
      <SpritelyDisplay spec={props.spec}></SpritelyDisplay>
    </div>
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        size: 16
      };
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
      updates = util.merge(this.state, updates);
      const me = this;
      HarvesterUtils.pixelizeImage(updates.original.dataURL, updates.size, updates.rows, updates.columns, ({ dataURL, spec }) => {
        updates.initial = ( updates.initial ||{} );
        updates.initial.dataURL = dataURL;
        updates.refinements = [ spec ];
        me.setState(updates);
      });
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
                  const size = e.target.value;
                  this.updateDim({ size, rows: size, columns: size });
                }}>
                  { sizes.map(size => <option value={size} selected={ size == this.state.size }>{size}</option> )}
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
              { (this.state.refinements || []).map((spec, i) => <div className="col-3">
                <Refinement spec={spec} index={i}></Refinement>
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