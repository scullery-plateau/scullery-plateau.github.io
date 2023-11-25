namespace("sp.purview.ScaleToScreen",{
},({}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        scaleToScreen: true
      };
      this.close = props.close;
      props.setOnOpen((value) => this.setState(value));
    }
    render() {
      return (<>
        <h3>Set Scale To Screen</h3>
        <div className="d-flex flex-column justify-content-center">
          <div className="input-group">
            <label for="screenUnit" className="input-group-text">Screen Units</label>
            <select id="screenUnit" value={this.state.screenUnit} 
                    className="form-control"
                    onChange={(e) => this.setState({ screenUnit: e.target.value })}>
              <option value="in" selected>Inches</option>
              <option value="cm">Centimeters</option>
              <option value="mm">Millimeters</option>
            </select>
          </div>
          <div className="input-group">
            <label for="screenWidth" className="input-group-text">Screen Width (in units)</label>
            <input type="number"
                   className="form-control"
                   id="screenWidth"
                   name="screenWidth"
                   min="0.01"
                   step="0.01"
                   value={this.state.screenWidth}
                   onChange={(e) => {
                     this.setState({ screenWidth: parseFloat(e.target.value) })
                   }}
            />
          </div>
          <div className="input-group">
            <label for="screenHeight" className="input-group-text">Screen Height (in units)</label>
            <input type="number"
                   className="form-control"
                   id="screenHeight"
                   name="screenHeight"
                   min="0.01"
                   step="0.01"
                   value={this.state.screenHeight}
                   onChange={(e) => {
                     this.setState({ screenHeight: parseFloat(e.target.value) })
                   }}
            />
          </div>
          <div className="input-group">
            <label for="screenSquare" className="input-group-text">Grid Square Size (in units)</label>
            <input type="number"
                   className="form-control"
                   id="screenSquare"
                   name="screenSquare"
                   min="0.01"
                   step="0.01"
                   value={this.state.screenSquare}
                   onChange={(e) => {
                     this.setState({ screenSquare: parseFloat(e.target.value) })
                   }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={() => this.close(this.state)}>Accept</button>
          <button className="btn btn-danger" onClick={() => this.close()}>Cancel</button>
        </div>
      </>);
    }
  }
});