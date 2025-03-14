namespace('sp.glyph.Glyph',{
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Utilities':'util',
  'sp.glyph.ImageDownload':'ImageDownload',
  'sp.glyph.LayerArgs':'LayerArgs',
  'sp.glyph.GlyphSVG':'GlyphSVG'
},({ ColorPicker, Colors, Dialog, FileDownload, Header, LoadFile, util, ImageDownload, LayerArgs, GlyphSVG }) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const about = [];
  const validateLoadFileJson = function() {};
  const layerTypes = [
    ['circle','Circle'],
    ['ellipse','Ellipse'],
    ['rect','Rectangle'],
    ['poly','Polygon']
  ];
  const layerTypeMap = layerTypes.reduce((out,[key,label]) => {
    out[key] = label;
    return out;
  }, {});
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        schematic: GlyphSVG.newSchematic(),
      };
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
        colorPicker: {
          componentClass: ColorPicker,
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
              const selectedLayer = 0;
              this.setState({ schematic, selectedLayer })
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
            defaultFilename:"glyph",
            jsonData:this.state.schematic
          });
        }
      },{
        id: 'downloadImage',
        label: 'Download Image',
        callback: () => {
          GlyphSVG.drawCanvasBase64(this.state.schematic,(canvasURL) => {
            this.modals.imageDownload.open({ defaultFilename: "glyph", canvasURL });
          });
        }
      },{
        id: 'about',
        label: 'About',
        callback: () => {
          Dialog.alert({
            label: "Glyph",
            lines: about
          });
        }
      }];
    }
    addLayer(){
      const { schematic } = util.merge(this.state);
      schematic.layers = schematic.layers.concat(GlyphSVG.newLayer(layerTypes[0][0]));
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
    copyLayer() {
      const { schematic } = util.merge(this.state);
      const layers = Array.from(schematic.layers);
      const temp = schematic.layers[this.state.selectedLayer];
      layers.splice(this.state.selectedLayer + 1, 0, util.merge(temp));
      schematic.layers = layers;
      const selectedLayer = this.state.selectedLayer + 1;
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
        style={ value?util.merge({ backgroundColor: value, color: Colors.getForegroundColor(value) },style):style }
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
    render() {
      const ColorPickerButton = (({label, field, getter, style}) => {
        return this.buildColorPickerButton(label, field, getter, style);
      })
      const ToggleButton = (({label, field}) => {
        return this.buildToggleButton(label,field);
      })
      const me = this;
      const buildStateInputGroup = ( inputId, inputLabel, keys, opts ) => {
        opts = opts || {};
        return util.buildNumberInputGroup(inputId, inputLabel, opts, () => util.getIn(me.state,keys), (value) => {
          me.setState(util.updateIn(me.state,keys,parseFloat(value)));
        });
      }
      const buildLayerInputGroup = ( inputId, inputLabel, layerField, defaultValue, opts, parser ) => {
        opts = opts || {};
        parser = parser || ((v) => parseFloat(v));
        return util.buildNumberInputGroup(inputId, inputLabel, opts, () => me.fromSelectedLayer(layerField,defaultValue), (value) => {
          me.updateSelectedLayer(layerField, parser(value));
        });
      }
      return <>
        <Header menuItems={this.menuItems} appTitle={'Glyph'} />
        <div className="row">
          <div className="col-7">
            <div className="d-flex flex-column">
              <div className="rpg-box text-light m-1 d-flex flex-column justify-content-center">
                <div className="row">
                  <div className="col-3">
                    { buildStateInputGroup('min-x','Min X', ['schematic','size','minX']) }
                  </div>
                  <div className="col-3">
                    { buildStateInputGroup('min-y','Min Y', ['schematic','size','minY']) }
                  </div>
                  <div className="col-3">
                    { buildStateInputGroup('max-x','Max X', ['schematic','size','maxX']) }
                  </div>
                  <div className="col-3">
                    { buildStateInputGroup('max-y','Max Y', ['schematic','size','maxY']) }
                  </div>
                  <div className="col-4">
                    { buildStateInputGroup('grid-size','Grid Size', ['schematic','grid','size']) }
                  </div>
                  <div className="col-4">
                    <div className="input-group">
                      <label htmlFor="grid-style" className="input-group-text">Grid Style</label>
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
                  <div className="col-4">
                    { buildStateInputGroup('grid-line-width','Grid Line Width', ['schematic','grid','lineWidth']) }
                  </div>
                </div>
              </div>
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="row">
                  <div className="col-5">
                    <div className="input-group">
                      <label htmlFor="layer-select" className="input-group-text">Layers:</label>
                      <select id="layer-select" className="form-control" value={ this.state.selectedLayer } onChange={(e) => {
                        this.setState({ selectedLayer: parseInt(e.target.value.toString()) })
                      }}>
                        {
                          this.state.schematic.layers.map((layer, index) => {
                            return <option
                              key={`layer-option-${index}`} value={index}
                            >{index}: { layerTypeMap[layer.type] }{layer.fill?` Fill: ${layer.fill}`:''}{layer.stroke?` Stroke: ${layer.stroke}`:''}</option>;
                          })
                        }
                      </select>
                    </div>
                  </div>
                  <div className="col-2">
                    <button title="Add Layer" className="btn btn-success" onClick={() => this.addLayer()}>+</button>
                    <button title="Remove Layer" className="btn btn-danger" onClick={() => this.removeLayer()}>-</button>
                  </div>
                  <div className="col-5">
                    <button title="Move To Back" className="btn btn-secondary" onClick={() => this.moveLayerToBack()}>
                      <i className="fas fa-fast-backward"></i>
                    </button>
                    <button title="Move Back" className="btn btn-secondary" onClick={() => this.moveLayerBack()}>
                      <i className="fas fa-step-backward"></i>
                    </button>
                    <button title="Move Forward" className="btn btn-secondary" onClick={() => this.moveLayerForward()}>
                      <i className="fas fa-step-forward"></i>
                    </button>
                    <button title="Move To Front" className="btn btn-secondary" onClick={() => this.moveLayerToFront()}>
                      <i className="fas fa-fast-forward"></i>
                    </button>
                    <button title="Duplicate Layer" className="btn btn-secondary" onClick={() => this.copyLayer()}>
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
              {
                this.state.selectedLayer >= 0 &&
                <>
                  <div className="rpg-box text-light m-1 d-flex flex-column">
                    <div className="row">
                      <div className="col-4">
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
                  </div>
                  <div className="rpg-box text-light m-1 d-flex flex-column">
                    <div className="row">
                      <div className="col-1">
                        <ColorPickerButton label="Fill" field="fill" getter={() => this.fromSelectedLayer('fill') } style={{}}/>
                        <ColorPickerButton label="Line" field="stroke" getter={() => this.fromSelectedLayer('stroke') } style={{}}/>
                      </div>
                      <div className="col-1">
                      </div>
                      <div className="col-5">
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
                      <div className="col-2">
                        <ToggleButton label="Rotate" field="rotate"/>
                      </div>
                      <div className="col-3">
                        { this.fromSelectedLayer('rotate') && buildLayerInputGroup('rotate-angle', 'Angle', 'rotateAngle', 0) }
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
          <div className="col-5">
            <div className="w-100 rpg-box text-light m-1 d-flex justify-content-center">
              <GlyphSVG schematic={this.state.schematic} selectLayer={(selectedLayer) => {
                this.setState({ selectedLayer });
              }}/>
            </div>
          </div>
        </div>
      </>;
    }
  }
});