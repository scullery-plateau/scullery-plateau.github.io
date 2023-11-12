namespace('sp.purview.Calibrator',{
  'sp.common.Utilities':'util',
  'sp.purview.Constants':'c'
},({ util, c }) => {
  const gridCalcs = {
    gridRows:function({ squareSize, gridRows, gridColumns, baseImg: { width, height }}) {
      squareSize = Math.floor(height / gridRows);
      gridColumns = Math.floor(width / squareSize);
      return { squareSize, gridRows, gridColumns }
    },
    gridColumns:function({ squareSize, gridRows, gridColumns, baseImg: { width, height }}) {
      squareSize = Math.floor(width / gridColumns);
      gridRows = Math.floor(height / squareSize);
      return { squareSize, gridRows, gridColumns }
    },
    squareSize:function({ squareSize, gridRows, gridColumns, baseImg: { width, height }}) {
      gridColumns = Math.floor(width / squareSize);
      gridRows = Math.floor(height / squareSize);
      return { squareSize, gridRows, gridColumns }
    },
  }
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
      this.close = props.close;
      props.setOnOpen((state) => this.setState(state));
    }
    calibrate(field,value){
      const gridCalc = gridCalcs[field];
      if (gridCalc) {
        const newState = util.merge(this.state,gridCalc(util.assoc(this.state, field, value)));
        newState.isValid = (newState.gridRows * newState.gridColumns <= c.maxSquareCount());
        this.setState(newState);
      }
    }
    render() {
      return (<div className="d-flex flex-column">
        <h3>Grid Calibrator</h3>
        <p>Purview is unable to automatically detect the dimensions of the grid of the image. Choose one of the following values to set, and the rest will be calculated, then the others should be able to be dialed in on the next screen.</p>
        <ul>
          <li>Square Size: { this.state.squareSize }</li>
          <li>Grid Rows: { this.state.gridRows }</li>
          <li>Grid Columns: { this.state.gridColumns }</li>
          <li>Square Count: { this.state.gridRows * this.state.gridColumns }</li>
        </ul>
        <div className="input-group my-2">
          <select id="fieldType" name="fieldType" value={ this.state.fieldType } 
                  onChange={(e) => { this.setState({ fieldType: e.target.value }) }}>
            <option disabled>Select dimension to set ....</option>
            <option value="squareSize">Square Size</option>
            <option value="gridRows">Grid Rows</option>
            <option value="gridColumns">Grid Columns</option>
          </select>
          <input
            disabled={!this.state.fieldType}
            id="fieldValue"
            name="fieldValue"
            type="number"
            className="form-control"
            value={ this.state.fieldValue }
            style={{ width: "4em"}}
            onChange={(e) => this.calibrate(this.state.fieldType,parseFloat(e.target.value))}/>
        </div>
        <div className="d-flex justify-content-right">
          <button className={`btn btn-${this.state.isValid?'success':'disabled'}`} 
                  disabled={!this.state.isValid} 
                  onClick={() => { this.close(this.state) }}>Confirm</button>
          <button className="btn btn-secondary" onClick={() => { this.close() }}>Cancel</button>
        </div>
      </div>);
    }
  }
});