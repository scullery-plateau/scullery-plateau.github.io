namespace("sp.purview.GridConfig",{
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.Utilities':'util',
  'sp.purview.Calibrator':'Calibrator',
  'sp.purview.Constants':'c'
},({ ColorPicker, Colors, Dialog, util, Calibrator, c }) => {
  const gcf = function(a, b) {
    if (a === b) {
      return a;
    } else if ( a > b) {
      return gcf(a - b, b);
    } else if ( a < b) {
      return gcf(a, b - a);
    }
  }
  const getGridCoordinates = function( columnIndex, rowIndex, squareSize ) {
    return {
      x: columnIndex * squareSize,
      y: rowIndex * squareSize
    }
  }
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = { 
        gridLineWidth: 3,
        gridLineColor: "#FF0000",
        squareSizeInterval: 1,
        multiplier: 1
      };
      this.close = props.close;
      props.setOnOpen((openValue) => {
        const { dataURL, baseImg } = openValue;
        const { width, height } = baseImg;
        const squareSize = gcf(width, height);
        const gridColumns = Math.floor(width / squareSize);
        const gridRows = Math.floor(height / squareSize);
        const squareCount = gridRows * gridColumns;
        const updates = util.merge(this.state, { 
          dataURL, 
          baseImg, 
          squareSize, 
          gridColumns, 
          gridRows, 
          initGridColumns: gridColumns, 
          initGridRows: gridRows, 
        });
        if (squareCount > c.maxSquareCount()) {
          this.modals.calibrator.open(updates);
        } else {
          this.setState(updates);
        }
      });
      this.modals = Dialog.factory({
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.buildGrid(index, color);
          },
        },
        calibrator: {
          componentClass: Calibrator,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: (state) => { this.setState(state) },
        }
      })
    }
    buildGrid(field,value){
      const updates = util.merge(this.state, util.assoc({},field,value));
      if (field === "multiplier") {
        // todo calc grid rows, grid columns, and square size from inits and multiplier
      }
      this.setState(updates);
    }
    buildColorPickerButton(label, field, classes, style) {
      const value = this.state[field];
      return <button
        className={`btn ${value?'btn-secondary':'btn-outline-light'} ${classes}`}
        title={`${label}: ${value}; click to select color, double click or right click to select 'none'`}
        style={ value?util.merge({ backgroundColor: value, color: Colors.getForegroundColor(value) },style):style }
        onClick={() => this.modals.colorPicker.open({ color: value || "#999999", index: field })}
        onDoubleClick={() => this.buildGrid(field, undefined) }
        onContextMenu={(e) => {
          e.preventDefault();
          this.buildGrid(field,undefined);
        }}>{label}</button>;
    }
    buildGridInitField(field, label, options) {
      options = options || {};
      return <div className="input-group my-2">
        <label htmlFor={field} className="input-group-text">{label}:</label>
        <input
          id={field}
          name={field}
          type="number"
          className="form-control"
          min={ options.min }
          step={ options.step }
          value={ this.state[field] }
          style={{ width: "4em"}}
          onChange={(e) => this.buildGrid(field,parseFloat(e.target.value))}/>
      </div>;
    }
    render() {
      if (this.state.dataURL && this.state.baseImg) {
        return (<>
          <div className="d-flex justify-content-center">
            <div className="rpg-box d-flex flex-column m-2">
              <ul>
                <li>Grid Rows: {this.state.gridRows}</li>
                <li>Grid Columns: {this.state.gridColumns}</li>
                <li>Square Size: {this.state.squareSize}</li>
              </ul>
              { this.buildGridInitField("multiplier", "Multiplier", { min: 1 }) }
              { this.buildGridInitField("gridLineWidth", "Grid Line Width", { min: 1 }) }
              { this.buildColorPickerButton("Grid Line Color", "gridLineColor", "my-2", {} ) }
            </div>
            <div className="rpg-box d-flex flex-column m-2">
              <div style={{maxHeight: "23em", maxWidth: "23em", overflow: "scroll"}}>
                <svg width="100%" height="100%" viewBox={`0 0  ${this.state.baseImg.width} ${this.state.baseImg.height}`}>
                  <image href={this.state.dataURL} height={this.state.baseImg.height} width={this.state.baseImg.width}/>
                  { Array(this.state.gridRows).fill("").map((_,rowIndex) => {
                    return Array(this.state.gridColumns).fill("").map((_,columnIndex) => {
                      const { x, y } = getGridCoordinates(columnIndex, rowIndex, this.state.squareSize);
                      return <rect x={x} y={y} width={this.state.squareSize} height={this.state.squareSize} fill="none" stroke={this.state.gridLineColor} strokeWidth={this.state.gridLineWidth} />;
                    })
                  }) }
                </svg>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success"
              onClick={ () => {
                const { dataURL, baseImg, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize } = this.state;
                this.close({dataURL, baseImg, gridRows, gridColumns, squareSize, gridLineColor, gridLineWidth});
              }}>Accept&nbsp;Grid&nbsp;&amp;&nbsp;Procede</button>
            <button className="btn btn-warning" onClick={ () => { this.close() }}>Cancel</button>
          </div>
        </>);
      }
    }
  }
});