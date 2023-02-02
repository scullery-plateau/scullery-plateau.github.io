namespace('sp.mondrian.Mondrian',{
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Utilities':'util',
  'sp.mondrian.ImageDownload':'ImageDownload',
  'sp.mondrian.LayerArgs':'LayerArgs',
  'sp.mondrian.MondrianSVG':'MondrianSVG'
},({ buildAbout, ColorPicker, Dialog, FileDownload, Header, LoadFile, util, ImageDownload, LayerArgs, MondrianSVG }) => {
  const about = [];
  const validateLoadFileJson = function() {};
  const layerTypes = [
    ['circle','Circle'],
    ['ellipse','Ellipse'],
    ['rect','Rectangle'],
    ['poly','Polygon']
  ];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        schematic: MondrianSVG.newSchematic(),
      };
      this.modals = Dialog.factory({
        about: {
          templateClass: buildAbout("Mondrian",about),
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {}
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
        colorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.updateSelectedLayer(index,color);
          },
        },
      });
      this.menuItems = [{
        id: 'loadFile',
        label: 'Load File',
        callback: () => {
          LoadFile(
            false,
            'text',
            (fileContent) => {
              const schematic = JSON.parse(fileContent);
              const error = validateLoadFileJson(schematic);
              if (error) {
                throw error;
              }
              this.setState({ schematic })
            },
            (fileName, error) => {
              console.log({ fileName, error });
              alert(fileName + ' failed to load. See console for error.');
            });
        }
      },{
        id: 'downloadFile',
        label: 'Download File',
        callback: () => {
          this.modals.fileDownload.open({
            defaultFilename:"mondrian",
            jsonData:this.state.schematic
          });
        }
      },{
        id: 'downloadImage',
        label: 'Download Image',
        callback: () => {
          MondrianSVG.drawCanvasBase64(this.state.schematic,(canvasURL) => {
            this.modals.imageDownload.open({ defaultFilename: "mondrian", canvasURL });
          });
        }
      },{
        id: 'about',
        label: 'About',
        callback: () => {
          this.modals.about.open();
        }
      }];
    }
    getLayerLabel(layer) {
      return layer.type;
    }
    addLayer(){
      const { schematic } = util.merge(this.state);
      schematic.layers = schematic.layers.concat([{ part: 'arm', index: 0, shading: 0 }]);
      const selectedLayer = schematic.layers.length - 1;
      this.setState({ schematic, selectedLayer });
    }
    removeLayer(){
      const { schematic } = util.merge(this.state);
      schematic.layers.splice(this.state.selectedLayer,1);
      const selectedLayer = schematic.layers.length - 1;
      this.setState({ schematic, selectedLayer });
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
    updateSelectedLayer(field,newValue) {
      const { schematic } = util.merge(this.state);
      schematic.layers = schematic.layers.map((l) => util.merge(l));
      const temp = schematic.layers[this.state.selectedLayer];
      const oldValue = temp[field];
      if ((typeof newValue) === 'function') {
        newValue = newValue(oldValue);
      }
      temp[field] = newValue;
      this.setState({ schematic });
    }
    fromSelectedLayer(field,defaultValue) {
      const retval = this.state.schematic.layers[this.state.selectedLayer][field];
      return (retval === undefined)?defaultValue:retval;
    }
    launchColorPicker(field) {
      this.modals.colorPicker.open({
        color: this.fromSelectedLayer(field) || "#999999",
        index: field
      });
    }
    buildColorPickerButton(label, field, getter, style) {
      const value = getter();
      return <button
        className={`btn ${value?'btn-secondary':'btn-outline-light'}`}
        title={`${label}: ${value}; click to select color, double click or right click to select 'none'`}
        style={ value?util.merge({ backgroundColor: value, color: util.getForegroundColor(value) },style):style }
        onClick={() => this.launchColorPicker(field)}
        onDoubleClick={() => this.updateSelectedLayer(field,undefined)}
        onContextMenu={(e) => {
          e.preventDefault();
          this.updateSelectedLayer(field,undefined)
        }}>{label}</button>;
    }
    toggleInLayer(field) {
      this.updateSelectedLayer(field, !(this.fromSelectedLayer(field)));
    }
    buildToggleButton(label, field) {
      return <button className={`btn ${this.fromSelectedLayer(field)?'btn-success':'btn-outline-secondary'}`} onClick={() => this.toggleInLayer(field)}>{label}</button>;

    }
    updateInState(keys,value) {
      const first = keys.shift();
      const last = keys.pop();
      const newState = util.merge(this.state[first]);
      const tempState = keys.reduce((temp, key) => {
        temp[key] = util.merge(temp[key]);
        return temp[key];
      },newState);
      tempState[last] = value;
      this.setState(newState);
    }
    render() {
      const ColorPickerButton = (({label, field, getter, style}) => {
        return this.buildColorPickerButton(label, field, getter, style);
      })
      const ToggleButton = (({label, field}) => {
        return this.buildToggleButton(label,field);
      })
      return <>
        <Header menuItems={this.menuItems} appTitle={'Mondrian'} />
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column">
            <div className="rpg-box text-light m-1 d-flex flex-column">
              <div className="d-flex justify-content-center">
                <div className="input-group">
                  <label htmlFor="min-x" className="input-group-text">Min X</label>
                  <input
                    id="min-x"
                    type="number"
                    className="form-control"
                    value={ this.state.schematic.minX }
                    onChange={(e) => this.updateInState(['schematic','size','minX'],parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="min-y" className="input-group-text">Min Y</label>
                  <input
                    id="min-y"
                    type="number"
                    className="form-control"
                    value={ this.state.schematic.minY }
                    onChange={(e) => this.updateInState(['schematic','size','minY'],parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="max-x" className="input-group-text">Max X</label>
                  <input
                    id="max-x"
                    type="number"
                    className="form-control"
                    value={ this.state.schematic.maxX }
                    onChange={(e) => this.updateInState(['schematic','size','maxX'],parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="max-y" className="input-group-text">Max Y</label>
                  <input
                    id="max-y"
                    type="number"
                    className="form-control"
                    value={ this.state.schematic.maxY }
                    onChange={(e) => this.updateInState(['schematic','size','maxY'],parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <label className="input-group-text">Grid</label>
                <div className="input-group">
                  <label htmlFor="grid-size" className="input-group-text">Size</label>
                  <input
                    id="grid-size"
                    type="number"
                    className="form-control"
                    value={ this.state.schematic.grid.size }
                    onChange={(e) => this.updateInState(['schematic','grid','size'],parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="grid-line-width" className="input-group-text">Line Width</label>
                  <input
                    id="grid-line-width"
                    type="number"
                    className="form-control"
                    value={ this.state.schematic.grid.lineWidth }
                    onChange={(e) => this.updateInState(['schematic','grid','lineWidth'],parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="grid-style" className="input-group-text">Style</label>
                  <select id="grid-style" className="form-control" value={ this.state.schematic.grid.style } onChange={(e) => {
                    this.updateInState(['schematic','grid','style'],e.target.value);
                  }}>
                    {
                      ['Solid','Dashed','Dotted','Single-Dot','None'].map((option, index) => {
                        return <option key={`grid-style-${index}`} value={option.toLowerCase()}>{option}</option>;
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="rpg-box text-light m-1 d-flex flex-column">
              <div className="d-flex justify-content-center">
                <div className="input-group">
                  <label htmlFor="layer-select" className="input-group-text">Layers:</label>
                  <select id="layer-select" className="form-control" value={ this.state.selectedLayer } onChange={(e) => {
                    this.setState({ selectedLayer: parseInt(e.target.value.toString()) })
                  }}>
                    {
                      this.state.schematic.layers.map((layer, index) => {
                        return <option key={`layer-option-${index}`} value={index}>{index}: { this.getLayerLabel(layer)}</option>;
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
              </div>
            </div>
            {
              this.state.selectedLayer >= 0 &&
              <>
                <div className="rpg-box text-light m-1 d-flex flex-column">
                  <div className="d-flex justify-content-center">
                    <div className="input-group">
                      <label htmlFor="layer-type-select" className="input-group-text">Layer Type:</label>
                      <select id="layer-type-select" className="form-control" value={ this.fromSelectedLayer('type') } onChange={(e) => {
                        this.updateSelectedLayer('type',e.target.value);
                      }}>
                        {
                          layerTypes.map(([type,label], index) => {
                            return <option key={`layer-type-option-${index}`} value={type}>{label}</option>;
                          })
                        }
                      </select>
                    </div>
                  </div>
                  <LayerArgs
                    fromLayer={(field,defaultValue) => this.fromSelectedLayer(field,defaultValue)}
                    updateLayer={(field,value) => this.updateSelectedLayer(field,value)}/>
                </div>
                <div className="rpg-box text-light m-1 d-flex flex-column">
                  <div className="d-flex justify-content-center">
                    <ColorPickerButton label="Fill" field="fill" getter={() => this.fromSelectedLayer('fill') } style={{}}/>
                    <ColorPickerButton label="Line" field="stroke" getter={() => this.fromSelectedLayer('stroke') } style={{}}/>
                    <div className="input-group">
                      <label htmlFor="stroke-width" className="input-group-text">Line Width:</label>
                      <input
                        id="stroke-width"
                        type="number"
                        className="form-control"
                        min={ 0 }
                        style={{width: "4em"}}
                        value={ this.fromSelectedLayer('strokeWidth') }
                        onChange={(e) => this.updateSelectedLayer('strokeWidth',parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="rpg-box text-light m-1 d-flex flex-column">
                  <div className="d-flex justify-content-center">
                    <ToggleButton label="Translate" field="translate"/>
                    { this.fromSelectedLayer('translate') &&
                      <>
                        <div className="input-group">
                          <label htmlFor="translate-x" className="input-group-text">X:</label>
                          <input
                            id="translate-x"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            value={ this.fromSelectedLayer('translate-x',0) }
                            onChange={(e) => this.updateSelectedLayer('translate-x',parseInt(e.target.value))}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="translate-y" className="input-group-text">Y:</label>
                          <input
                            id="translate-y"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            value={ this.fromSelectedLayer('translate-y',0) }
                            onChange={(e) => this.updateSelectedLayer('translate-y',parseInt(e.target.value))}
                          />
                        </div>
                      </>
                    }
                  </div>
                  <div className="d-flex justify-content-center">
                    <ToggleButton label="Rotate" field="rotate"/>
                    {this.fromSelectedLayer('rotate') &&
                      <>
                        <div className="input-group">
                          <label htmlFor="rotate-cx" className="input-group-text">CX:</label>
                          <input
                            id="rotate-cx"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            value={this.fromSelectedLayer('rotate-cx',0)}
                            onChange={(e) => this.updateSelectedLayer('rotate-cx', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="rotate-cy" className="input-group-text">CY:</label>
                          <input
                            id="rotate-cy"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            value={this.fromSelectedLayer('rotate-cy',0)}
                            onChange={(e) => this.updateSelectedLayer('rotate-cy', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="rotate-angle" className="input-group-text">Angle:</label>
                          <input
                            id="rotate-angle"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            min={0}
                            max={360}
                            value={this.fromSelectedLayer('rotate-angle',0)}
                            onChange={(e) => this.updateSelectedLayer('rotate-angle', parseInt(e.target.value)%360)}
                          />
                        </div>
                      </>
                    }
                  </div>
                  <div className="d-flex justify-content-center">
                    <ToggleButton label="Scale" field="scale"/>
                    { this.fromSelectedLayer('scale') &&
                      <>
                        <div className="input-group">
                          <label htmlFor="scale-x" className="input-group-text">X:</label>
                          <input
                            id="scale-x"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            step={0.01}
                            value={ this.fromSelectedLayer('scale-x',1.00) }
                            onChange={(e) => this.updateSelectedLayer('scale-x',parseInt(e.target.value))}
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="scale-y" className="input-group-text">Y:</label>
                          <input
                            id="scale-y"
                            type="number"
                            className="form-control"
                            style={{width: "4em"}}
                            step={0.01}
                            value={ this.fromSelectedLayer('scale-y',1.00) }
                            onChange={(e) => this.updateSelectedLayer('scale-y',parseInt(e.target.value))}
                          />
                        </div>
                      </>
                    }
                  </div>
                </div>
              </>
            }
          </div>
          <MondrianSVG schematic={this.state.schematic}/>
        </div>
      </>;
    }
  }
});