namespace('sp.mondrian.Mondrian',{
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Utilities':'util',
  'sp.mondrian.ImageDownload':'ImageDownload',
  'sp.mondrian.MondrianSVG':'MondrianSVG'
},({ buildAbout, ColorPicker, Dialog, FileDownload, Header, LoadFile, util, ImageDownload, MondrianSVG }) => {
  const about = [];
  const validateLoadFileJson = function() {};
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        schematic: MondrianSVG.newSchematic()
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
            this.setColorFromPicker(index, color);
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
    setColorFromPicker(index, color) {
      // todo
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
    render() {
      return <>
        <Header menuItems={this.menuItems} appTitle={'Mondrian'} />
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column">
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
          </div>
          <MondrianSVG schematic={this.state.schematic}/>
        </div>
      </>;
    }
  }
});