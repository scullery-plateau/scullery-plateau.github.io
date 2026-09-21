namespace('sp.outfitter.Diagnostics', {
  'gizmo-atheneum.namespaces.paper-doll.Dataset': 'Dataset',
  'sp.outfitter.OutfitterSVG': 'OutfitterSVG',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  'sp.common.Utilities':'util',
  'sp.outfitter.Constants':'c'
}, ({ Dataset, OutfitterSVG, Dialog, FileDownload, LoadFile, ProgressBar, util, c }) => {
  const buttonScale = 1/3;
  const [ percentOfScreenWidth, percentOfScreenHeight ] = [ 0.25, 0.75 ];

  const getPatternId = function(patternIndex) {
    return patternIndex >= 0 && `patterns-${ patternIndex >= 10 ? '' : '0' }${ patternIndex }`;
  }

  const splashButtons = [
    { label: 'Fit', type: 'fit', image: 'fit.png', width: 413, height: 833 },
    { label: 'Hulk', type: 'hulk', image: 'bulk.png', width: 824, height: 960 },
    { label: 'Superman', type: 'superman', image: 'muscled.png', width: 509, height: 887 },
    { label: 'Woman', type: 'woman', image: 'woman.png', width: 320, height: 802 },
  ];

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        showOutline: true,
        showRepeat: true,
        showOrigin: true,
        xOffset: 0,
        yOffset: 0,
        selectedPattern: 0
      };
      this.modals = Dialog.factory({
        fileDownload: {
          componentClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {}
        }
      });
    }

    loadMeta(bodyType, schematic) {
      this.setState({ schematic, progress: 1, bodyType });
      Dataset.load(bodyType, schematic.version, percentOfScreenWidth, percentOfScreenHeight, (dataset) => {
        this.setState({ metadata: dataset, progress: undefined });
      }, (resp) => {
        console.error(resp);
      }, (state) => {
        const progress = (100 * (state.state + 1)) / (state.max + 1);
        this.setState({ progress });
      });
    }

    loadDiagnostic(bodyType) {
      const url = `./patternAlign${bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}.json`;
      fetch(url)
        .then(response => response.json())
        .then(schematic => {
          this.loadMeta(bodyType, schematic);
        });
    }

    // This function modifies the SVG pattern definition in the metadata 
    // to reflect the current slider positions and diagnostic toggles.
    updatePatternInMeta(metadata) {
      const patternId = getPatternId(this.state.selectedPattern);
      if (!metadata || !metadata.patterns || !metadata.patterns[patternId]) return metadata;

      const newMeta = util.merge(metadata);
      newMeta.patterns = util.merge(metadata.patterns);
      
      let patternDef = metadata.patterns[patternId];
      
      // Inject X and Y offsets into the <pattern> tag
      patternDef = patternDef.replace(/x='[^']*'/, `x='${this.state.xOffset}'`);
      patternDef = patternDef.replace(/y='[^']*'/, `y='${this.state.yOffset}'`);

      // Handle Repeat toggle by making pattern dimensions effectively infinite
      if (!this.state.showRepeat) {
        patternDef = patternDef.replace(/width='[^']*'/, `width='5000'`);
        patternDef = patternDef.replace(/height='[^']*'/, `height='5000'`);
      }

      // Inject the 20px Red Dot at the origin (0,0) of the pattern's coordinate system
      if (this.state.showOrigin) {
        const dot = `<circle cx="0" cy="0" r="10" fill="red" />`;
        patternDef = patternDef.replace('</pattern>', `${dot}</pattern>`);
      }

      newMeta.patterns[patternId] = patternDef;
      return newMeta;
    }

    render() {
      if (!this.state.schematic) {
        // SPLASH PAGE
        return (
          <div className="d-flex flex-column h-100 justify-content-center">
            <h1 className="text-center mb-4">Outfitter: Pattern Diagnostics</h1>
            <div className="d-flex justify-content-around">
              {splashButtons.map(btn => (
                <button key={btn.type} className="btn btn-primary p-3" onClick={() => this.loadDiagnostic(btn.type)}>
                  <img alt={btn.label} src={`../assets/${btn.image}`} width={btn.width * buttonScale} height={btn.height * buttonScale}/>
                  <div className="mt-2 h4">{btn.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
      } else if (this.state.progress) {
        return <ProgressBar subject="Loading Datasets..." progress={this.state.progress}/>;
      } else {
        // DIAGNOSTIC INTERFACE
        const modifiedSchematic = util.merge(this.state.schematic);
        modifiedSchematic.layers = modifiedSchematic.layers.map(l => {
          const layer = util.merge(l);
          layer.pattern = this.state.selectedPattern;
          if (!this.state.showOutline) delete layer.outline;
          return layer;
        });

        const modifiedMeta = this.updatePatternInMeta(this.state.metadata);

        return (
          <div className="row justify-content-center mt-3">
            <div className="col-4 d-flex flex-column">
              <div className="rpg-box text-light">
                <div className="d-flex flex-column justify-content-center">
                  <h4 className="border-bottom mb-3 pb-2 text-center">Diagnostic Controls</h4>
                  
                  <div className="mb-3">
                    <label className="form-label d-flex justify-content-between">
                      Pattern Index <span>{this.state.selectedPattern}</span>
                    </label>
                    <input type="range" className="form-range" min="0" max={this.state.metadata.getPatternCount() - 1} value={this.state.selectedPattern}
                      onChange={(e) => this.setState({ selectedPattern: parseInt(e.target.value) })} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex justify-content-between">
                      X Offset <span>{this.state.xOffset}px</span>
                    </label>
                    <input type="range" className="form-range" min="-250" max="250" step="0.5" value={this.state.xOffset}
                      onChange={(e) => this.setState({ xOffset: parseFloat(e.target.value) })} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-flex justify-content-between">
                      Y Offset <span>{this.state.yOffset}px</span>
                    </label>
                    <input type="range" className="form-range" min="-250" max="250" step="0.5" value={this.state.yOffset}
                      onChange={(e) => this.setState({ yOffset: parseFloat(e.target.value) })} />
                  </div>

                  <hr className="bg-light"/>

                  <div className="form-check form-switch mb-2">
                    <input className="form-check-input" type="checkbox" checked={this.state.showOutline}
                      onChange={(e) => this.setState({ showOutline: e.target.checked })} />
                    <label className="form-check-label">Show Body Outline</label>
                  </div>

                  <div className="form-check form-switch mb-2">
                    <input className="form-check-input" type="checkbox" checked={this.state.showRepeat}
                      onChange={(e) => this.setState({ showRepeat: e.target.checked })} />
                    <label className="form-check-label">Repeat Pattern</label>
                  </div>

                  <div className="form-check form-switch mb-4">
                    <input className="form-check-input" type="checkbox" checked={this.state.showOrigin}
                      onChange={(e) => this.setState({ showOrigin: e.target.checked })} />
                    <label className="form-check-label">Show Red Origin Dot</label>
                  </div>

                  <button className="btn btn-success btn-lg mb-2" onClick={() => {
                    this.modals.fileDownload.open({
                      defaultFilename: `align_${this.state.bodyType}_pat${this.state.selectedPattern}`,
                      jsonData: {
                        bodyType: this.state.bodyType,
                        patternIndex: this.state.selectedPattern,
                        x: this.state.xOffset,
                        y: this.state.yOffset
                      }
                    });
                  }}>Download Data</button>
                  
                  <button className="btn btn-outline-light" onClick={() => this.setState({ schematic: undefined })}>
                    <i className="fas fa-arrow-left me-2"></i>Change Body Type
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-8 d-flex justify-content-center">
              <div className="rpg-box p-3 bg-secondary" style={{ minWidth: "400px" }}>
                <OutfitterSVG 
                  schematic={ modifiedSchematic }
                  meta={ modifiedMeta }
                  selectLayer={() => {}}
                />
              </div>
            </div>
          </div>
        );
      }
    }
  };
});
