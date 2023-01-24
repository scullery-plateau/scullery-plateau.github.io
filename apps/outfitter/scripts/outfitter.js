namespace('sp.outfitter.Outfitter', {
  'sp.common.Ajax':'Ajax',
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Dialog':'Dialog',
  'sp.common.FileDownload':'FileDownload',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.outfitter.Constants':'c',
  'sp.outfitter.OutfitterSVG':'OutfitterSVG'
}, ({ Ajax, buildAbout, ColorPicker, Dialog, FileDownload, Header, LoadFile, c, OutfitterSVG }) => {
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
          <div className="row">
            <div className="col-4 d-flex flex-column">
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="d-flex justify-content-center">
                  <div className="input-group">
                    <label htmlFor="layer-select" className="input-group-text">Layer:</label>
                    <select id="layer-select" className="form-control">
                      <option value="0">0: torso 0</option>
                      <option value="1">1: legs 0</option>
                      <option value="2">2: arm 0</option>
                      <option value="3">3: arm 0</option>
                      <option value="4">4: head 0</option>
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
                    id="flip-button"
                    className="btn btn-secondary"
                    onClick={() => this.flipLayer()}
                  >
                    Flip?
                  </button>
                </div>
              </div>
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label htmlFor="part-type" className="input-group-text">Part Type:</label>
                  <select className="p-2 form-control" id="part-type">
                    <option disabled hidden selected value>Select Part Type</option>
                    <optgroup label="Body">
                      <option value="arm">Arm</option>
                      <option value="head">Head</option>
                      <option value="legs">Legs</option>
                      <option value="torso">Torso</option>
                    </optgroup>
                    <optgroup label="Face">
                      <option value="beard">Beard</option>
                      <option value="ears">Ears</option>
                      <option value="eyebrows">Eyebrows</option>
                      <option value="eyes">Eyes</option>
                      <option value="hair">Hair</option>
                      <option value="mouth">Mouth</option>
                      <option value="nose">Nose</option>
                    </optgroup>
                    <optgroup label="Tights">
                      <option value="gloves">Gloves</option>
                      <option value="mask">Mask</option>
                      <option value="shirt">Shirt</option>
                      <option value="stockings">Stockings</option>
                      <option value="tights">Leggings</option>
                    </optgroup>
                    <optgroup label="Clothing">
                      <option value="belt">Belt</option>
                      <option value="boots">Boots</option>
                      <option value="chest">Chest</option>
                      <option value="collar">Collar</option>
                      <option value="gauntlets">Gauntlets</option>
                      <option value="hat">Hat</option>
                      <option value="pants">Pants</option>
                      <option value="sholders">Shoulders</option>
                    </optgroup>
                    <optgroup label="Back">
                      <option value="back">Back</option>
                      <option value="wings_and_tails">Wings &amp; Tails</option>
                    </optgroup>
                    <optgroup label="Accessories">
                      <option value="accessories_and_shields">
                        Accessories &amp; Shields
                      </option>
                      <option value="guns">Guns</option>
                      <option value="melee_weapons">Melee Weapons</option>
                      <option value="ranged_weapons">Ranged Weapons</option>
                      <option value="swords">Swords</option>
                      <option value="symbol_A">Symbol A</option>
                      <option value="symbol_B">Symbol B</option>
                    </optgroup>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="part-index" className="input-group-text">Part Index:</label>
                  <input
                    id="part-index"
                    type="number"
                    className="form-control"
                    min="0"
                    style={{ width: "4em" }}
                  />
                </div>
              </div>
              <div className="rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label htmlFor="body-scale" className="input-group-text">Body Scale:</label>
                  <select id="body-scale" className="form-control">
                    <option>default</option>
                    <option>lanky</option>
                    <option>thin</option>
                    <option>teen</option>
                    <option>stocky</option>
                    <option>petite</option>
                  </select>
                </div>
                <div className="d-flex">
                  <button
                    id="bg-color"
                    className="btn btn-secondary"
                    style={{ minWidth: "6em" }}
                    onClick={() => this.launchColorPicker('background')}>
                    BG Color
                  </button>
                  <div className="input-group">
                    <label htmlFor="bg-pattern" className="input-group-text">BG Pattern:</label>
                    <input
                      id="bg-pattern"
                      type="number"
                      className="form-control"
                      min="-1"
                      style={{width: "3em"}}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 d-flex justify-content-center">
              <div className="rpg-box m-1">
                <OutfitterSVG schematic={ this.state.schematic } meta={ this.state.metadata } defs={ this.state.defs }/>
              </div>
            </div>
            <div className="col-4 d-flex flex-column">
              <div className=" rpg-box text-light m-1 d-flex justify-content-evenly">
                <button
                  id="base-color"
                  className="btn btn-secondary"
                  onClick={() => this.launchColorPicker('base')}
                >
                  Base
                </button>
                <button
                  id="detail-color"
                  className="btn btn-secondary"
                  onClick={() => this.launchColorPicker('detail')}
                >
                  Detail
                </button>
                <button
                  id="outline-color"
                  className="btn btn-secondary"
                  onClick={() => this.launchColorPicker('outline')}>
                  Outline
                </button>
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
                  />
                  <label htmlFor="resize-y" className="input-group-text">Y</label>
                  <input
                    id="resize-y"
                    type="number"
                    className="form-control"
                    step="0.01"
                  />
                </div>
                <div className="input-group">
                  <label className="input-group-text">Move</label>
                  <label htmlFor="move-x" className="input-group-text">X</label>
                  <input
                    id="move-x"
                    type="number"
                    className="form-control"
                  />
                  <label htmlFor="move-y" className="input-group-text">Y</label>
                  <input
                    id="move-y"
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>
              <div className=" rpg-box text-light m-1 d-flex flex-column">
                <div className="input-group">
                  <label htmlFor="opacity" className="input-group-text">Opacity:</label>
                  <input
                    id="opacity"
                    type="number"
                    className="form-control"
                    step="0.01"
                    style={{width: "4em"}}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="pattern" className="input-group-text">Pattern:</label>
                  <input
                    id="pattern"
                    type="number"
                    className="form-control"
                    min="-1"
                    style={{width: "4em"}}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="shading" className="input-group-text">Shading:</label>
                  <input
                    id="shading"
                    type="number"
                    className="form-control"
                    min="-1"
                    style={{width: "4em"}}
                  />
                </div>
              </div>
            </div>
          </div>
        </>;
      }
    }
  };
});
