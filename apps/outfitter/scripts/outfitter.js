namespace('sp.outfitter.Outfitter', {
  'sp.common.Ajax':'Ajax',
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LinkShare':'LinkShare',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  'sp.common.QueryParams':'QueryParams',
  'sp.common.Utilities':'util',
  'sp.outfitter.Constants':'c',
  'sp.outfitter.ImageDownload':'ImageDownload',
  'sp.outfitter.OutfitterSVG':'OutfitterSVG',
  'sp.outfitter.Shareable':'Shareable'
}, ({ Ajax, buildAbout, ColorPicker, Colors, Dialog, FileDownload, Header, LinkShare, LoadFile, ProgressBar, QueryParams, util, c, ImageDownload, OutfitterSVG, Shareable }) => {
  const validateLoadFileJson = function(data) {}
  const buttonScale = 1/3;
  const about = [];
  const getDefaultSchematic = function(bodyType) {
    return {
      bodyType,
      bgColor: '#cccccc',
      layers: [
        { part: 'torso', index: 0, shading: 0 },
        { part: 'legs', index: 0, shading: 0 },
        { part: 'arm', index: 0, shading: 0 },
        { part: 'arm', index: 0, shading: 0, flip: true },
        { part: 'head', index: 0, shading: 0 }
      ]
    };
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.modals = Dialog.factory({
        about: {
          templateClass: buildAbout("Outfitter",about),
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
        fileDownload: {
          templateClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {}
        },
        imageDownload: {
          templateClass: ImageDownload,
          attrs: { class: 'rpg-box text-light w-50' },
          onClose: () => {}
        },
        linkShare: {
          templateClass: LinkShare,
          attrs: { class: 'rpg-box text-light w-50' },
          onClose: () => {}
        },
        colorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.setColorFromPicker(index, color);
          },
        },
      });
      this.menuItems = [{
        id: 'downloadFile',
        label: 'Download File',
        callback: () => {
          this.modals.fileDownload.open({
            defaultFilename:"outfitter",
            jsonData:this.state.schematic
          });
        }
      },{
        id: 'shareAsLink',
        label: 'Share As Link',
        callback: () => {
          this.modals.linkShare.open(Shareable.publish(this.state.schematic));
        }
      },{
        id: 'downloadImage',
        label: 'Download Image',
        callback: () => {
          // alert("'Download Image' is not available at this time");
          this.modals.imageDownload.open({
            defaultFilename: "outfitter",
            svgData: OutfitterSVG.buildSVG(this.state.schematic,this.state.metadata)
          });
        }
      },{
        id: 'about',
        label: 'About',
        callback: () => {
          this.modals.about.open();
        }
      }];
      const schematic = Shareable.parse();
      if (schematic) {
        this.loadMeta(schematic.bodyType,schematic,true);
      }
    }
    loadMeta(bodyType,schematic,onInit) {
      if (onInit) {
        this.state = {schematic, progress: 1, selectedLayer: 0};
      } else {
        this.setState({schematic, progress: 1, selectedLayer: 0});
      }
      Ajax.getLocalStaticFileAsText(`https://scullery-plateau.github.io/apps/outfitter/datasets/${bodyType}2.json`,
        {
          success: (responseText) => {
            const metadata = JSON.parse(responseText);
            metadata.patternCount = Object.keys(metadata.patterns).length;
            metadata.shadingCount = Object.keys(metadata.shadings).length;
            this.setState({ metadata, progress: undefined, selectedLayer: 0});
          },
          failure: (resp) => {
            console.log(resp);
            throw resp;
          },
          stateChange: (state) => {
            const progress = (100 * (state.state + 1)) / (state.max + 1);
            this.setState({progress})
          }
        });
    }
    loadNew(bodyType){
      this.loadMeta(bodyType,getDefaultSchematic(bodyType));
    }
    loadSchematic(){
      LoadFile(
        false,
        'text',
        (fileContent) => {
          const schematic = JSON.parse(fileContent);
          const error = validateLoadFileJson(schematic);
          if (error) {
            throw error;
          }
          try {
            const url = Shareable.publish(schematic);
            console.log({ url });
          } catch (e) {
            console.log(e)
          }
          this.loadMeta(schematic.bodyType,schematic);
        },
        (fileName, error) => {
          console.log({ fileName, error });
          alert(fileName + ' failed to load. See console for error.');
        });
    }
    updateSchematic(field,value) {
      const { schematic } = util.merge(this.state);
      schematic.layers = schematic.layers.map((l) => util.merge(l));
      schematic[field] = value;
      this.setState({ schematic });
    }
    addLayer(){
      const { schematic } = util.merge(this.state);
      schematic.layers = schematic.layers.concat([{ part: 'arm', index: 0, shading: 0 }]);
      const selectedLayer = schematic.layers.length - 1;
      this.setState({ schematic, selectedLayer });
    }
    removeLayer(){
      const { schematic } = util.merge(this.state);
      if (schematic.layers.length > 1) {
        schematic.layers.splice(this.state.selectedLayer,1);
        const selectedLayer = schematic.layers.length - 1;
        this.setState({ schematic, selectedLayer });
      }
    }
    moveLayerToBack(){
      const { schematic } = util.merge(this.state);
      const temp = schematic.layers[this.state.selectedLayer];
      schematic.layers.splice(this.state.selectedLayer,1);
      schematic.layers = [temp].concat(schematic.layers);
      const selectedLayer = 0;
      this.setState({ schematic, selectedLayer });
    }
    moveLayerBack(){
      if(this.state.selectedLayer > 0) {
        const { schematic } = util.merge(this.state);
        const temp = schematic.layers[this.state.selectedLayer];
        schematic.layers.splice(this.state.selectedLayer,1);
        const selectedLayer = this.state.selectedLayer - 1;
        schematic.layers.splice(selectedLayer,0,temp);
        this.setState({ schematic, selectedLayer });
      }
    }
    moveLayerForward(){
      if(this.state.selectedLayer < this.state.schematic.layers.length - 1) {
        const { schematic } = util.merge(this.state);
        const temp = schematic.layers[this.state.selectedLayer];
        schematic.layers.splice(this.state.selectedLayer,1);
        const selectedLayer = this.state.selectedLayer + 1;
        schematic.layers.splice(selectedLayer,0,temp);
        this.setState({ schematic, selectedLayer });
      }
    }
    moveLayerToFront(){
      const { schematic } = util.merge(this.state);
      const temp = schematic.layers[this.state.selectedLayer];
      schematic.layers.splice(this.state.selectedLayer,1);
      schematic.layers = schematic.layers.concat([temp]);
      const selectedLayer = schematic.layers.length - 1;
      this.setState({ schematic, selectedLayer });
    }
    flipLayer(){
      this.updateLayer("flip",(v) => !v);
    }
    copyLayer() {
      const { schematic } = util.merge(this.state);
      const layers = Array.from(schematic.layers);
      const temp = schematic.layers[this.state.selectedLayer];
      layers.splice(this.state.selectedLayer + 1, 0, util.merge(temp));
      schematic.layers = layers;
      const selectedLayer = this.state.selectedLayer + 1;
      this.setState({ schematic, selectedLayer });
    }
    updateLayer(field,newValue) {
      const updates = {};
      if (typeof field === 'string') {
        updates[field] = newValue;
      } else if (typeof field === 'object') {
        Object.entries(field).forEach(([k,v]) => {
          updates[k] = v;
        });
      }
      const { schematic } = util.merge(this.state);
      schematic.layers = schematic.layers.map((l) => util.merge(l));
      Object.entries(updates).reduce((out,[k, v]) => {
        const oldValue = out[k];
        if ((typeof v) === 'function') {
          v = v(oldValue);
        }
        if (!v && ((typeof v) !== 'number')) {
          delete out[k];
        } else {
          out[k] = v;
        }
        return out;
      }, schematic.layers[this.state.selectedLayer]);
      this.setState({ schematic });
    }
    fromSelectedLayer(field,defaultValue) {
      const retval = this.state.schematic.layers[this.state.selectedLayer][field];
      return (retval === undefined)?defaultValue:retval;
    }
    launchColorPicker(field) {
      if (field === 'background') {
        this.modals.colorPicker.open({
          color: this.state.schematic.bgColor || "#999999",
          index: field
        });
      } else {
        this.modals.colorPicker.open({
          color: this.fromSelectedLayer(field) || "#999999",
          index: field
        });
      }
    }
    setColorFromPicker(field,color){
      if (field === 'background') {
        this.updateSchematic('bgColor',color);
      } else {
        this.updateLayer(field,color);
      }
    }
    buildColorPickerButton(label, field, getter, style) {
      const value = getter();
      return <button
        className={`btn ${value?'btn-secondary':'btn-outline-light'}`}
        title={`${label}: ${value}; click to select color, double click or right click to select 'none'`}
        style={ value?util.merge({ backgroundColor: value, color: Colors.getForegroundColor(value) },style):style }
        onClick={() => this.launchColorPicker(field)}
        onDoubleClick={() => this.setColorFromPicker(field,undefined)}
        onContextMenu={(e) => {
          e.preventDefault();
          this.setColorFromPicker(field,undefined)
        }}>{label}</button>;
    }
    render() {
      if (!this.state.schematic) {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <h4 className="text-center">Click <a href="./gallery.html">here</a> view a gallery of Outfitter images with datafiles!</h4>
          <div className="d-flex flex-column">
            <div className="m-2 d-flex justify-content-center">
              <button className="btn btn-success" onClick={ () => this.loadSchematic() }>Load File</button>
            </div>
            <div className="m-2 d-flex justify-content-around">
              <button className="btn btn-primary" onClick={ () => this.loadNew('fit') }>
                <img alt="fit" src="assets/fit.png" width={413 * buttonScale} height={833 * buttonScale}/>
              </button>
              <button className="btn btn-primary" onClick={ () => this.loadNew('hulk') }>
                <img alt="bulk" src="assets/bulk.png" width={824 * buttonScale} height={960 * buttonScale}/>
              </button>
              <button className="btn btn-primary" onClick={ () => this.loadNew('superman') }>
                <img alt="muscled" src="assets/muscled.png" width={509 * buttonScale} height={887 * buttonScale}/>
              </button>
              <button className="btn btn-primary" onClick={ () => this.loadNew('woman') }>
                <img alt="woman" src="assets/woman.png" width={320 * buttonScale} height={802 * buttonScale}/>
              </button>
            </div>
          </div>
        </>;
      } else if (this.state.progress) {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <ProgressBar subject="display configuration" progress={this.state.progress}/>
        </>;
      } else {
        const ColorPickerButton = (({label, field, getter, style}) => {
          return this.buildColorPickerButton(label, field, getter, style);
        })
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <div className="row">
            <div className="col-4 d-flex flex-column">
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="d-flex justify-content-center">
                  <div className="input-group">
                    <label htmlFor="layer-select" className="input-group-text">Layer:</label>
                    <select id="layer-select" className="form-control" value={ this.state.selectedLayer } onChange={(e) => {
                      this.setState({ selectedLayer: parseInt(e.target.value.toString()) })
                    }}>
                      {
                        this.state.schematic.layers.map((layer, index) => {
                          return <option key={`layer-option-${index}`} value={index}>{ c.getLayerLabel(index,layer) }</option>;
                        })
                      }
                    </select>
                  </div>
                  <button
                    title="Add Layer"
                    className="btn btn-success"
                    onClick={() => this.addLayer()}>+</button>
                  <button
                    title="Remove Layer"
                    className="btn btn-danger"
                    onClick={() => this.removeLayer()}>-</button>

                </div>
                <div className="d-flex justify-content-around">
                  <button
                    title="Move To Back"
                    className="btn btn-secondary"
                    onClick={() => this.moveLayerToBack()}
                  >
                    <i className="fas fa-fast-backward"></i>
                  </button>
                  <button
                    title="Move Back"
                    className="btn btn-secondary"
                    onClick={() => this.moveLayerBack()}
                  >
                    <i className="fas fa-step-backward"></i>
                  </button>
                  <button
                    title="Move Forward"
                    className="btn btn-secondary"
                    onClick={() => this.moveLayerForward()}
                  >
                    <i className="fas fa-step-forward"></i>
                  </button>
                  <button
                    title="Move To Front"
                    className="btn btn-secondary"
                    onClick={() => this.moveLayerToFront()}
                  >
                    <i className="fas fa-fast-forward"></i>
                  </button>
                  <button
                    title="Copy Layer"
                    className="btn btn-secondary"
                    onClick={() => this.copyLayer()}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                  <button
                    id="flip-button"
                    className={`btn ${this.fromSelectedLayer("flip",false)?'flipped':"not-flipped"}`}
                    onClick={() => this.flipLayer()}
                  >
                    Flip?
                  </button>
                </div>
              </div>
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label htmlFor="part-type" className="input-group-text">Part Type:</label>
                  <select className="p-2 form-control" id="part-type" value={ this.fromSelectedLayer('part') } onChange={(e) => {
                    const part = e.target.value;
                    const maxIndex = this.state.metadata.parts[part].length - 1;
                    const index = Math.min(this.fromSelectedLayer('index'),maxIndex);
                    this.updateLayer({ part, index });
                  }}>
                    <option disabled hidden value>Select Part Type</option>
                    {
                      c.getPartGroups().map((group,partGroupIndex) => {
                        return <optgroup key={`part-group-option-${partGroupIndex}`} label={group}>
                          {
                            c.getPartTypesByGroup(group).map((partType,partTypeIndex) => {
                              return <option key={`part-type-index-${partGroupIndex}-${partTypeIndex}`} value={partType.part}>{partType.label}</option>;
                            })
                          }
                        </optgroup>;
                      })
                    }
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="part-index" className="input-group-text">Part Index:</label>
                  <input
                    id="part-index"
                    type="number"
                    className="form-control"
                    min={0}
                    max={ this.state.metadata.parts[this.fromSelectedLayer('part')].length - 1 }
                    style={{ width: "4em" }}
                    value={ this.fromSelectedLayer('index') }
                    onChange={(e) => {
                      this.updateLayer('index', Math.max(0,Math.min(this.state.metadata.parts[this.fromSelectedLayer('part')].length - 1,parseInt(e.target.value || 0))))
                    }}/>
                </div>
              </div>
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label htmlFor="body-scale" className="input-group-text">Body Scale:</label>
                  <select id="body-scale" className="form-control" value={ this.state.schematic.bodyScale }
                          onChange={(e) => this.updateSchematic('bodyScale',e.target.value) }>
                    <option>default</option>
                    {
                      OutfitterSVG.getBodyScales().map((bodyScale, index) => {
                        return <option key={`bodyScale-${index}`} value={bodyScale}>{bodyScale}</option>;
                      })
                    }
                  </select>
                </div>
                <div className="d-flex">
                  <ColorPickerButton label="BG Color" field="background" getter={() => this.state.schematic.bgColor } style={{minWidth:"6em"}}/>
                  <div className="input-group">
                    <label htmlFor="bg-pattern" className="input-group-text">BG Pattern:</label>
                    <input
                      id="bg-pattern"
                      type="number"
                      className="form-control"
                      min={-1}
                      max={ this.state.metadata.patternCount }
                      style={{width: "3em"}}
                      value={ isNaN(this.state.schematic.bgPattern)?-1:this.state.schematic.bgPattern }
                      onChange={(e) => this.updateSchematic('bgPattern',parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 d-flex justify-content-center">
              <div className="rpg-box m-1">
                <OutfitterSVG schematic={ this.state.schematic } meta={ this.state.metadata } selectLayer={(layerIndex) => {
                  this.setState({ selectedLayer: layerIndex });
                }}/>
              </div>
            </div>
            <div className="col-4 d-flex flex-column">
              <div className=" rpg-box text-light m-1 d-flex flex-column">
                <div className="d-flex justify-content-evenly">
                  <ColorPickerButton label="Base" field="base" getter={() => this.fromSelectedLayer('base') } style={{}}/>
                  <ColorPickerButton label="Detail" field="detail" getter={() => this.fromSelectedLayer('detail') } style={{}}/>
                  <ColorPickerButton label="Outline" field="outline" getter={() => this.fromSelectedLayer('outline') } style={{}}/>
                </div>
                <div className="input-group">
                  <label htmlFor="opacity" className="input-group-text">Opacity:</label>
                  <input
                    id="opacity"
                    type="number"
                    className="form-control"
                    step={0.01}
                    min={0.00}
                    max={1.00}
                    style={{width: "2em"}}
                    value={ this.fromSelectedLayer('opacity',1.0) }
                    onChange={(e) => this.updateLayer('opacity',parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className=" rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label className="input-group-text">Resize</label>
                  <label htmlFor="resize-x" className="input-group-text">X</label>
                  <input
                    id="resize-x"
                    type="number"
                    className="form-control"
                    step="0.01"
                    value={ this.fromSelectedLayer('resizeX',1.00) }
                    onChange={(e) => this.updateLayer('resizeX',parseFloat(e.target.value))}
                  />
                  <label htmlFor="resize-y" className="input-group-text">Y</label>
                  <input
                    id="resize-y"
                    type="number"
                    className="form-control"
                    step="0.01"
                    value={ this.fromSelectedLayer('resizeY',1.00) }
                    onChange={(e) => this.updateLayer('resizeY',parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-group-text">Move</label>
                  <label htmlFor="move-x" className="input-group-text">X</label>
                  <input
                    id="move-x"
                    type="number"
                    className="form-control"
                    value={ this.fromSelectedLayer('moveX',0) }
                    onChange={(e) => this.updateLayer('moveX',parseFloat(e.target.value))}
                  />
                  <label htmlFor="move-y" className="input-group-text">Y</label>
                  <input
                    id="move-y"
                    type="number"
                    className="form-control"
                    value={ this.fromSelectedLayer('moveY',0) }
                    onChange={(e) => this.updateLayer('moveY',parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className=" rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label htmlFor="pattern" className="input-group-text">Pattern:</label>
                  <input
                    id="pattern"
                    type="number"
                    className="form-control"
                    min={-1}
                    max={ this.state.metadata.patternCount }
                    style={{width: "4em"}}
                    value={ this.fromSelectedLayer('pattern',-1) }
                    onChange={(e) => this.updateLayer('pattern',parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="shading" className="input-group-text">Shading:</label>
                  <input
                    id="shading"
                    type="number"
                    className="form-control"
                    min={-1}
                    max={ this.state.metadata.shadingCount }
                    style={{width: "4em"}}
                    value={ this.fromSelectedLayer('shading',-1) }
                    onChange={(e) => this.updateLayer('shading',parseFloat(e.target.value))}/>
                </div>
              </div>
            </div>
          </div>
        </>;
      }
    }
  };
});
