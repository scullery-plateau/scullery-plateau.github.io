namespace('sp.outfitter.Outfitter', {
  'sp.common.Ajax':'Ajax',
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.outfitter.OutfitterSVG':'OutfitterSVG'
}, ({ Ajax, buildAbout, ColorPicker, Dialog, FileDownload, Header, LoadFile, OutfitterSVG }) => {
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
        { part: 'head', index: 0, shading: 0 },
      ],
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
        colorPicker: {
          templateClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            alert("file load not yet implemented")
            // todo
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
        id: 'about',
        label: 'About',
        callback: () => {
          this.modals.about.open();
        }
      }];
    }
    loadMeta(bodyType,schematic) {
      this.setState({schematic, progress: 1});
      Ajax.getLocalStaticFileAsText(`https://scullery-plateau.github.io/apps/outfitter/datasets/${bodyType}.svg`,
        {
          success: (fullDefs) => {
            let [h, defs, t] = fullDefs.split('defs');
            defs = defs.substring(1, defs.length - 2);
            this.setState({ fullDefs, defs });
            Ajax.getLocalStaticFileAsText(`https://scullery-plateau.github.io/apps/outfitter/datasets/${bodyType}.json`,
              {
                success: (responseText) => {
                  const metadata = JSON.parse(responseText);
                  this.setState({ metadata, progress: undefined });
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
          this.loadMeta(schematic.bodyType,schematic);
        },
        (fileName, error) => {
          console.log({ fileName, error });
          alert(fileName + ' failed to load. See console for error.');
        });
    }
    render() {
      if (!this.state.schematic) {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <div className="d-flex flex-column">
            <div className="m-2 d-flex justify-content-center">
              <button className="btn btn-success" onClick={ () => this.loadSchematic() }>Load File</button>
            </div>
            <div className="m-2 d-flex justify-content-around">
              <button className="btn btn-primary" onClick={ () => this.loadNew('fit') }>
                <img alt="fit" src="assets/fit.png" width={413 * buttonScale} height={833 * buttonScale}/>
              </button>
              <button className="btn btn-primary" onClick={ () => this.loadNew('hulk') }>
                <img alt="fit" src="assets/bulk.png" width={824 * buttonScale} height={960 * buttonScale}/>
              </button>
              <button className="btn btn-primary" onClick={ () => this.loadNew('superman') }>
                <img alt="fit" src="assets/muscled.png" width={509 * buttonScale} height={887 * buttonScale}/>
              </button>
              <button className="btn btn-primary" onClick={ () => this.loadNew('woman') }>
                <img alt="fit" src="assets/woman.png" width={320 * buttonScale} height={802 * buttonScale}/>
              </button>
            </div>
          </div>
        </>;
      } else if (this.state.progress) {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <div className="d-flex flex-column">
            <p>Loading display configuration data, please wait....</p>
            <div className="progress">
              <div className="progress-bar" style={{width: `${this.state.progress}%`}}>{this.state.progress}%</div>
            </div>
          </div>
        </>;
      } else {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <svg width="0" height="0"><defs>{this.state.defs}</defs></svg>
          <OutfitterSVG schematic={ this.state.schematic } meta={ this.state.metadata }/>
        </>;
      }
    }
  };
});
