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
      this.state = { canvasId: props.canvasId };
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
    loadMapImage() {
      LoadFile(
        false,
        'dataURL',
        (map) => {
          const playerView = new PlayerView();
          playerView.open();
          playerView.update({ map });
          playerView.setBackgroundColor("black");
          this.setState({ map, playerView });
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
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
            <img style={{width: "20em", height: "20em"}} src={this.state.map}/>
          </div>
        }
      </>);
    }
  }
});