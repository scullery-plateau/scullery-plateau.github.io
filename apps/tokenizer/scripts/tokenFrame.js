namespace("sp.tokenizer.TokenFrame",{
  'sp.tokenizer.Token':'Token'
},({Token}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.token;
      this.tokenIndex = props.index;
    }
    render() {
      return <div className="rpg-box m-3 d-flex">
        <div className="d-flex flex-column w-25 controls">
          <div className="form-group">
            <label htmlFor="xOffset">X-Offset:</label>
            <input
              type="number"
              value={ this.state.xOffset }
              className="form-control"
              id="xOffset"
              onChange={(e) => { this.setState({ xOffset: parseInt(e.target.value) }); }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="yOffset">Y-Offset:</label>
            <input
              type="number"
              value={ this.state.yOffset }
              className="form-control"
              id="yOffset"
              onChange={(e) => { this.setState({ yOffset: parseInt(e.target.value) }); }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="scale">Scale:</label>
            <input
              type="number"
              min="0"
              value={ this.state.scale }
              step="0.01"
              className="form-control"
              id="scale"
              onChange={(e) => { this.setState({ scale: parseFloat(e.target.value) }); }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sideCount">Side Count:</label>
            <input
              type="number"
              min="2"
              max="50"
              value={ this.state.sideCount }
              className="form-control"
              id="sideCount"
              onChange={(e) => { this.setState({ sideCount: parseInt(e.target.value) }); }}
            />
          </div>
          <button className="btn btn-light">Frame Color</button>
        </div>
        <Token token={ this.state } frameSize="20em"/>
      </div>;
    }
  }
});
