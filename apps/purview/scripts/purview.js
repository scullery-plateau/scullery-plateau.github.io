namespace("sp.purview.Purview",{
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  "sp.common.Utilities":"util",
  "sp.purview.PlayerView":"PlayerView",
},({ buildAbout, Dialog, EditMode, Header, LoadFile, util, PlayerView}) => {
  const about = [];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        canvasId: props.canvasId,
        scale: 1.0,
        xOffset: 0,
        yOffset: 0,
        bgColor: "black",
      };
      this.modals = Dialog.factory({
        about: {
          componentClass: buildAbout("Purview",about),
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: () => {},
        },
      });
      this.menuItems = [{
        id: 'about',
        label: 'About',
        callback: () => {
          this.modals.about.open();
        }
      }];
    }
    applyUpdates(stateUpdates) {
      stateUpdates = stateUpdates || {};
      const { dataURL, baseImg, playerView } = [ dataURL, baseImg, playerView ]
      // todo
      playerView.update({ map: dataURL });
      playerView.setBackgroundColor(bgColor);
      this.setState(stateUpdates);
    }
    loadMapImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL) => {
          util.initImageObj(dataURL,(baseImg) => {
            const playerView = new PlayerView();
            playerView.open();
            playerView.setOnResize(() => {
              this.applyUpdates();
            });
            this.applyUpdates({ dataURL, baseImg, playerView });
          });
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
    }
    update(field, value) {
      const updates = {};
      updates[field] = value;
      this.applyUpdates(updates);
    }
    render() {
      return (<>
        <Header menuItems={this.menuItems} appTitle={'Purview'} />
        { !this.state.map && 
          (<>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={() => this.loadMapImage()}>Load Map Image</button>
            </div>
          </>) }
        { this.state.map && 
          <div className="d-flex justify-content-center">
            <div className="rpg-box d-flex flex-column m-2">
              <div className="input-group my-2">
                <label htmlFor="scale" className="input-group-text">Scale:</label>
                <input
                  id="scale"
                  type="number"
                  className="form-control"
                  min={ 0 }
                  step={ 0.01 }
                  value={ this.state.scale }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update("scale",parseFloat(e.target.value))}/>
              </div>
              <div className="input-group my-2">
                <label htmlFor="scale" className="input-group-text">X-Offset:</label>
                <input
                  id="scale"
                  type="number"
                  className="form-control"
                  value={ this.state.xOffset }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update("xOffset",parseFloat(e.target.value))}/>
              </div>
              <div className="input-group my-2">
                <label htmlFor="scale" className="input-group-text">yOffset:</label>
                <input
                  id="scale"
                  type="number"
                  className="form-control"
                  value={ this.state.yOffset }
                  style={{ width: "4em"}}
                  onChange={(e) => this.update('yOffset',parseFloat(e.target.value))}/>
              </div>
            </div>
            <div className="rpg-box m-2">
              <img style={{width: "20em", height: "20em"}} src={this.state.map}/>
            </div>
          </div>
        }
      </>);
    }
  }
});