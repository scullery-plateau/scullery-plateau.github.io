namespace("sp.purview.Purview",{
  'sp.common.Ajax':'Ajax',
  'sp.common.BuildAbout':'buildAbout',
  'sp.common.Dialog':'Dialog',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.ProgressBar':'ProgressBar',
  "sp.common.Sidecar":"Sidecar",
  "sp.common.Utilities":"util",
  "sp.purview.PlayerView":"PlayerView",
},({ Ajax, buildAbout, Dialog, Header, LoadFile, ProgressBar, Sidecar, util, PlayerView}) => {
  const about = [];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      Ajax.getLocalStaticFileAsText("https://scullery-plateau.github.io/apps/purview/assets/playerview.tpl",
      {
        success: ({ responseText }) => {
          try{
            const sidecar = Sidecar.build({
              sidecarName: "playerView", 
              initHTML: responseText, 
              appRootId: "app-root", 
              componentClass: PlayerView
            });
            EditMode.enable();
            this.setState({ sidecar, progress: undefined });
          } catch (e) {
            console.log({ responseText, e });
          }
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
      this.modals = Dialog.factory({
        about: {
          templateClass: buildAbout("Purview",about),
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
      // TODO
    }
    render() {
      return (<>
        <Header menuItems={this.menuItems} appTitle={'Purview'} />
        { this.state.progress && 
          <ProgressBar subject="player view template" progress={this.state.progress}/>}
        { this.state.sidecar && !this.state.map && 
          (<>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={() => this.loadMapImage()}>Load Map Image</button>
            </div>
          </>) }
        { this.state.map && 
          <></>
        }
      </>);
    }
  }
});