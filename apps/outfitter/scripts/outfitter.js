namespace('sp.outfitter.Outfitter', {
  'sp.common.Header':'Header'
}, ({ Header }) => {
  const buttonScale = 1/3;
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.menuItems = [];
    }
    loadNew(bodyType){}
    loadSchematic(){}
    render() {
      if (this.state.bodyType) {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <div className="">
            
          </div>
        </>;
      } else {
        return <>
          <Header menuItems={this.menuItems} appTitle={'Outfitter'} />
          <div className="d-flex flex-column">
            <div className="m-2 d-flex justify-content-center">
              <button className="btn btn-success" onClick={() => this.loadSchematic()}>Load File</button>
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
      }
    }
  };
});
