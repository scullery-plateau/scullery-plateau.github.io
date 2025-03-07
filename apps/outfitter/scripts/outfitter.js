namespace('sp.outfitter.Outfitter', {
  'gizmo-atheneum.namespaces.paper-doll.Dataset': 'Dataset',
  'gizmo-atheneum.namespaces.react.PaperDoll': 'PaperDoll',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LinkShare':'LinkShare',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  'sp.common.Utilities':'util',
  'sp.outfitter.Constants':'c',
  'sp.outfitter.ImageDownload':'ImageDownload',
  'sp.outfitter.Shareable':'Shareable'
}, ({ Dataset, PaperDoll, ColorPicker, Colors, Dialog, EditMode, FileDownload, Header, LinkShare, LoadFile, ProgressBar, util, c, ImageDownload, Shareable }) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const buttonScale = 1/3;
  const latestVersion = "0.0.1";
  const defaultVersion = "0.0.1";
  const validateLoadFileJson = function(data) {}
  const about = [];
  const getDefaultSchematic = function(bodyType) {
    return {
      bodyType,
      bgColor: '#cccccc',
      version: latestVersion,
      layers: [
        { part: 'torso', index: 0, shading: 0 },
        { part: 'legs', index: 0, shading: 0 },
        { part: 'arm', index: 0, shading: 0 },
        { part: 'arm', index: 0, shading: 0, flip: true },
        { part: 'head', index: 0, shading: 0 }
      ]
    };
  }
  const keyDownActions = {
    "arrowrightctrldown": [ "resizeX", 0.01, 1.00 ],
    "arrowleftctrldown": [ "resizeX", -0.01, 1.00 ],
    "arrowupctrldown": [ "resizeY", 0.01, 1.00 ],
    "arrowdownctrldown": [ "resizeY", -0.01, 1.00 ],
    "arrowrightshiftdown": [ "moveX", 1, 0 ],
    "arrowleftshiftdown": [ "moveX", -1, 0 ],
    "arrowupshiftdown": [ "moveY", -1, 0 ],
    "arrowdownshiftdown": [ "moveY", 1, 0 ],
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {tab:0};
      this.keyHandlers = {};
      Object.entries(keyDownActions).forEach(([event, [field, step, defaultValue]]) => {
        const handler = (() => { this.stepLayer(field, step, defaultValue); });
        this.keyHandlers[event] = handler;
        document.addEventListener(event, handler);
      });
      this.modals = Dialog.factory({
        fileDownload: {
          componentClass: FileDownload,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {}
        },
        imageDownload: {
          componentClass: ImageDownload,
          attrs: { class: 'rpg-box text-light w-50' },
          onClose: () => {}
        },
        linkShare: {
          componentClass: LinkShare,
          attrs: { class: 'rpg-box text-light w-50' },
          onClose: () => {}
        },
        colorPicker: {
          componentClass: ColorPicker,
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
          var [ width, height ] = Dataset.calcFrameFromScreen(0.25, 0.75);
          var { viewBox, content } = this.state.metadata.drawSVG(this.state.schematic)
          this.modals.imageDownload.open({
            defaultFilename: "outfitter",
            svgData: { viewBox, content, width, height }
          });
        }
      },{
        id: 'about',
        label: 'About',
        callback: () => {
          Dialog.alert({
            label: "Outfitter",
            lines: about
          });
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
      Dataset.load(bodyType, schematic.version, (dataset) => {
        EditMode.enable();
        this.setState({ metadata: dataset, progress: undefined, selectedLayer: 0});
      }, (resp) => {
        console.log(resp);
        throw resp;
      }, (state) => {
        const progress = (100 * (state.state + 1)) / (state.max + 1);
        this.setState({progress})
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
          schematic.version = schematic.version || defaultVersion;
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
    stepLayer(field,step,defaultValue) {
      this.updateLayer(field, this.fromSelectedLayer(field, defaultValue) + step);
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
    updateTab(event, tab) {
      event.preventDefault();
      this.setState({ tab });
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
          <div className="row justify-content-center">
            <div className="col-5 d-flex flex-column">
              <div className="rpg-box text-light">
                <div className="d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-around my-1">
                    <div className="input-group flex-grow-1 my-0 mx-1">
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
                    <button title="Add Layer" className="btn btn-success my-0 mx-1" onClick={() => this.addLayer()}>+</button>
                    <button title="Remove Layer" className="btn btn-danger my-0 mx-1" onClick={() => this.removeLayer()}>-</button>
                  </div>
                  <div className="d-flex justify-content-around my-1">
                    <button title="Move To Back" className="btn btn-secondary my-0" onClick={() => this.moveLayerToBack()}><i className="fas fa-fast-backward"></i></button>
                    <button title="Move Back" className="btn btn-secondary my-0" onClick={() => this.moveLayerBack()}><i className="fas fa-step-backward"></i></button>
                    <button title="Move Forward" className="btn btn-secondary my-0" onClick={() => this.moveLayerForward()}><i className="fas fa-step-forward"></i></button>
                    <button title="Move To Front" className="btn btn-secondary my-0" onClick={() => this.moveLayerToFront()}><i className="fas fa-fast-forward"></i></button>
                    <button title="Copy Layer" className="btn btn-secondary my-0" onClick={() => this.copyLayer()}><i className="fas fa-copy"></i></button>
                    <button id="flip-button" className={`btn ${this.fromSelectedLayer("flip",false)?'flipped':"not-flipped"} my-0`} onClick={() => this.flipLayer()}>Flip?</button>
                  </div>
                  <div className="d-flex justify-content-around my-1">
                    <div className="input-group my-0 mx-1">
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
                    <div className="input-group my-0 mx-1">
                      <label htmlFor="part-index" className="input-group-text">Part Index:</label>
                      <input
                        id="part-index"
                        type="number"
                        className="form-control"
                        min={0}
                        max={ this.state.metadata.parts[this.fromSelectedLayer('part')].length - 1 }
                        value={ this.fromSelectedLayer('index') }
                        onChange={(e) => {
                          this.updateLayer('index', Math.max(0,Math.min(this.state.metadata.parts[this.fromSelectedLayer('part')].length - 1,parseInt(e.target.value || 0))))
                        }}/>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around my-0">
                    <div className="d-flex flex-column justify-content-around">
                      <ColorPickerButton label="Base" field="base" getter={() => this.fromSelectedLayer('base') } style={{}}/>
                      <ColorPickerButton label="Detail" field="detail" getter={() => this.fromSelectedLayer('detail') } style={{}}/>
                      <ColorPickerButton label="Outline" field="outline" getter={() => this.fromSelectedLayer('outline') } style={{}}/>
                    </div>
                    <div className="d-flex flex-column justify-content-end">
                      <div className="d-flex align-content-center justify-content-end">
                        <label htmlFor="opacity" className="form-label mx-1">Opacity ({this.fromSelectedLayer('opacity',1.0).toFixed(2)})</label>
                        <input
                          id="opacity"
                          type="range"
                          className="form-range mx-1"
                          step={0.01}
                          min={0.01}
                          max={1.00}
                          style={{width: "5em"}}
                          value={ this.fromSelectedLayer('opacity',1.0) }
                          onChange={(e) => this.updateLayer('opacity',parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="d-flex align-content-center justify-content-end">
                        <label htmlFor="pattern" className="form-label mx-1">Pattern ({this.fromSelectedLayer('pattern',-1)})</label>
                        <input
                          id="pattern"
                          type="range"
                          className="form-range mx-1"
                          min={-1}
                          max={ this.state.metadata.patternCount }
                          step={1}
                          style={{width: "5em"}}
                          value={ this.fromSelectedLayer('pattern',-1) }
                          onChange={(e) => this.updateLayer('pattern',parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="d-flex align-content-center justify-content-end">
                        <label htmlFor="shading" className="form-label mx-1">Shading ({this.fromSelectedLayer('shading',-1)})</label>
                        <input
                          id="shading"
                          type="range"
                          className="form-range mx-1"
                          min={-1}
                          max={ this.state.metadata.shadingCount }
                          step={1}
                          style={{width: "5em"}}
                          value={ this.fromSelectedLayer('shading',-1) }
                          onChange={(e) => this.updateLayer('shading',parseFloat(e.target.value))}/>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around my-0">
                    <span>Resize ( {this.fromSelectedLayer('resizeX',1.00).toFixed(2)}, {this.fromSelectedLayer('resizeY',1.00).toFixed(2)} )</span>
                    <button title="Shrink Horizontally" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('resizeX',this.fromSelectedLayer('resizeX',1.00) - 0.01);
                    }}>
                      <i className="fas fa-down-left-and-up-right-to-center" style={{ transform: "rotate(45deg)"}}></i>
                    </button>
                    <button title="Shrink Vertically" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('resizeY',this.fromSelectedLayer('resizeY',1.00) - 0.01);
                    }}>
                      <i className="fas fa-down-left-and-up-right-to-center" style={{ transform: "rotate(135deg)"}}></i>
                    </button>
                    <button title="Stretch Horizontally" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('resizeX',this.fromSelectedLayer('resizeX',1.00) + 0.01);
                    }}>
                      <i className="fas fa-arrows-left-right"></i>
                    </button>
                    <button title="Stretch Vertically" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('resizeY',this.fromSelectedLayer('resizeY',1.00) + 0.01);
                    }}>
                      <i className="fas fa-arrows-left-right fa-rotate-90"></i>
                    </button>
                  </div>
                  <div className="d-flex justify-content-around my-0">
                    <span>Move ({this.fromSelectedLayer('moveX', 1).toFixed(2)}, {this.fromSelectedLayer('moveY',1).toFixed(2)})</span>
                    <button title="Move Left" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('moveX',this.fromSelectedLayer('moveX',1) - 1);
                    }}><i className="fas fa-arrow-left"></i></button>
                    <button title="Move Right" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('moveX',this.fromSelectedLayer('moveX',1) + 1);
                    }}><i className="fas fa-arrow-right"></i></button>
                    <button title="Move Up" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('moveY',this.fromSelectedLayer('moveY',1) - 1);
                    }}><i className="fas fa-arrow-up"></i></button>
                    <button title="Move Down" className="btn btn-secondary" onClick={(e) => {
                      this.updateLayer('moveY',this.fromSelectedLayer('moveY',1) + 1);
                    }}><i className="fas fa-arrow-down"></i></button>
                  </div>
                  <div className="d-flex justify-content-around my-0 align-items-center">
                    <div className="d-flex justify-content-around align-items-center w-50">
                      <span class="mx-1">Rotate ( {this.fromSelectedLayer('rotate',0)} )</span>
                      <button title="Rotate Left" className="btn btn-secondary mx-1" onClick={(e) => {
                        const value = this.fromSelectedLayer('rotate',0);
                        if (value > 0) {
                          this.updateLayer('rotate', value - 1);
                        } else {
                          this.updateLayer('rotate', 359);
                        }
                      }}><i className="fas fa-rotate-left"></i></button>
                      <button title="Rotate Right" className="btn btn-secondary mx-1" onClick={(e) => {
                        this.updateLayer('rotate',(this.fromSelectedLayer('rotate',0) + 1) % 360);
                      }}><i className="fas fa-rotate-right"></i></button>
                    </div>
                    <div className="d-flex justify-content-around w-50">
                      <div className="input-group">
                        <label htmlFor="body-scale" className="input-group-text">Body Scale:</label>
                        <select id="body-scale" className="form-control" value={ this.state.schematic.bodyScale }
                                style={{ width: "5em" }}
                                onChange={(e) => this.updateSchematic('bodyScale',e.target.value) }>
                          <option>default</option>
                          {
                            Dataset.getBodyScales().map((bodyScale, index) => {
                              return <option key={`bodyScale-${index}`} value={bodyScale}>{bodyScale}</option>;
                            })
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around my-1">
                    <div className="d-flex align-content-center justify-content-end my-0 w-50">
                      <label htmlFor="bg-pattern" className="form-label my-0 mx-1">BG Pattern ({isNaN(this.state.schematic.bgPattern)?-1:this.state.schematic.bgPattern})</label>
                      <input
                        id="bg-pattern"
                        type="range"
                        className="form-range my-0 mx-1"
                        min={-1}
                        max={ this.state.metadata.patternCount }
                        step={1}
                        style={{ width: "5em"}}
                        value={ isNaN(this.state.schematic.bgPattern)?-1:this.state.schematic.bgPattern }
                        onChange={(e) => this.updateSchematic('bgPattern',parseInt(e.target.value))}
                      />
                    </div>
                    <ColorPickerButton label="BG Color" field="background" getter={() => this.state.schematic.bgColor } style={{width: "100%!important", margin: 0}}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5 h-100 d-flex justify-content-center">
              <div className="rpg-box m-1">
                <PaperDoll 
                  dataset={ this.state.metadata } 
                  schematic={ this.state.schematic } 
                  selectLayer={(layerIndex) => {
                    this.setState({ selectedLayer: layerIndex });
                  }}/>
              </div>
            </div>
          </div>
        </>;
      }
    }
  };
});
