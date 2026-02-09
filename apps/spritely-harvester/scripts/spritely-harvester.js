namespace("sp.spritely-harvester.SpritelyHarvester", {
  "sp.common.Colors": "Colors",
  'sp.common.Utilities':'util',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Header': 'Header',
  'sp.spritely-harvester.HarvesterUtils': "HarvesterUtils",
  'sp.spritely-harvester.SpritelyDisplay': "SpritelyDisplay",
}, ({ Colors, util, LoadFile, Header, HarvesterUtils, SpritelyDisplay }) => {
  const sizes = [16,32,48];
  const Thumbnail = function(props) {
    return <div className="thumbnail rpg-box d-flex flex-column">
      <span className="align-self-center">{props.label}</span>
      <div
        className="frame align-self-center"
        style={{ backgroundImage: `url(${props.dataURL})` }}
      ></div>
    </div>;
  }
  const Refinement = function(props) {
    return <div className="thumbnail rpg-box d-flex flex-column">
      <span className="align-self-center">{props.spec.palette.length} Colors</span>
      <div className="frame align-self-center">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          const downloadName = `${props.filename}__${props.spec.size}__${props.spec.palette.length}`
          util.triggerJSONDownload(downloadName, "", props.spec);
        }}>
          <SpritelyDisplay spec={props.spec}></SpritelyDisplay>
        </a>
      </div>
    </div>;
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        size: 16,
      };
      this.menuItems = [];
    }
    loadImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL, filename) => {
          this.updateDim({ original: { dataURL }, filename:filename.split(".")[0] });
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
      HarvesterUtils.pixelizeImage(updates.original.dataURL, updates.size, ({ dataURL, spec }) => {
        updates.initial = ( updates.initial ||{} );
        updates.initial.dataURL = dataURL;
        updates.refinements = [ spec ];
        try {
          updates.refinements.push(HarvesterUtils.initCondense(spec, Colors.get216PaletteColors()));
        } catch(error) {
          console.log({ error });
          // cannot condense, not adding condensed image
        }
        me.setState(updates);
      });
    }
    render() {
      console.log({ state: this.state });
      return <>
        <Header menuItems={this.menuItems} appTitle={'Spritely Harvester'} />
        { this.state.original ? <>
          <h1 className="text-center">{this.state.filename}</h1>
          <div className="d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-center">
              <div className="">
                <label htmlFor="coreDim" className="form-label">Select Dimentions from Spritely Defaults:</label>
                <select id="coreDim" className="form-select" value={this.state.size} onChange={(e) => {
                  const size = parseInt(e.target.value);
                  this.updateDim({ size });
                }}>
                  { sizes.map(size => <option value={size}>{size}</option> )}
                </select>
              </div>
            </div>
            <div className="row justify-content-center mt-3 mb-3">
              <div className="col-3">
                <Thumbnail label="Original" dataURL={this.state.original.dataURL}></Thumbnail>
              </div>
              { this.state.initial && <div className="col-3">
                <Thumbnail label="Initial" dataURL={this.state.initial.dataURL}></Thumbnail>
              </div>}
              { (this.state.refinements || []).map((spec, i) => <div className="col-3">
                <Refinement spec={spec} index={i} filename={this.state.filename}></Refinement>
              </div>)}
            </div>
          </div>
        </> : <div className="text-center mt-5 mb-5">
          <p>Click the button below to choose an image to convert to a Spritely pixel file.</p>
          <button className="btn btn-success text-center" onClick={() => this.loadImage()}>Load Image</button>
        </div>}
      </>;
    }
  }
});