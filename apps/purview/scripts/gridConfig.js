namespace("sp.purview.GridConfig",{
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.Utilities':'util'
},({ ColorPicker, Colors, Dialog, util }) => {
  const gcf = function(a, b) {
    if (a === b) {
      return a;
    } else if ( a > b) {
      return gcf(a - b, b);
    } else if ( a < b) {
      return gcf(a, b - a);
    }
  }
  const calcGridFromMargins = function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, marginRight, marginBottom, baseImg: { width, height }}) {
    gridColumns = Math.floor((width - marginLeft - marginRight) / squareSize);
    gridRows = Math.floor((height - marginTop - marginBottom) / squareSize);
    return { squareSize, gridRows, gridColumns }
  };
  const gridCalcs = {
    gridRows:function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, marginRight, marginBottom, baseImg: { width, height }}) {
      const columnWidth = Math.floor((width - marginLeft - marginRight) / gridColumns);
      const rowHeight = Math.floor((height - marginTop - marginBottom) / gridRows);
      squareSize = Math.min(columnWidth, rowHeight);
      gridColumns = Math.floor((width - marginLeft - marginRight) / squareSize);
      return { squareSize, gridRows, gridColumns }
    },
    gridColumns:function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, marginRight, marginBottom, baseImg: { width, height }}) {
      const columnWidth = Math.floor((width - marginLeft - marginRight) / gridColumns);
      const rowHeight = Math.floor((height - marginTop - marginBottom) / gridRows);
      squareSize = Math.min(columnWidth, rowHeight);
      gridRows = Math.floor((height - marginTop - marginBottom) / squareSize);
      return { squareSize, gridRows, gridColumns }
    },
    squareSize:function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, marginRight, marginBottom, baseImg: { width, height }}) {
      gridColumns = Math.floor((width - marginLeft - marginRight) / squareSize);
      gridRows = Math.floor((height - marginTop - marginBottom) / squareSize);
      return { squareSize, gridRows, gridColumns }
    },
    marginLeft:calcGridFromMargins,
    marginTop:calcGridFromMargins,
    marginRight:calcGridFromMargins,
    marginBottom:calcGridFromMargins
  }
  const frameCalcs = {
    cell:function({ squareSize, gridColumns, marginLeft, marginTop, cellIndex }){
      const rowIndex = Math.floor(cellIndex / gridColumns);
      const columnIndex = cellIndex % gridColumns;
      return {
        viewX: marginLeft + columnIndex * squareSize,
        viewY: marginTop + rowIndex * squareSize,
        viewWidth: squareSize,
        viewHeight: squareSize
      }
    },
    full:function({baseImg: { width, height }}){
      return {
        viewX: 0,
        viewY: 0,
        viewWidth: width,
        viewHeight: height
      };
    }
  }
  const getGridCoordinates = function(columnIndex, rowIndex, { squareSize, marginLeft, marginTop}) {
    return {
      x: columnIndex * squareSize + marginLeft,
      y: rowIndex * squareSize + marginTop
    }
  }
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = { 
        viewMode: "full",
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0, 
        marginBottom: 0,         
        gridLineWidth: 3,
        gridLineColor: "#FF0000",
        zoom: 20,
        cellIndex: 0,
        squareSizeInterval: 1
      };
      this.close = props.close;
      props.setOnOpen((openValue) => {
        const { dataURL, baseImg } = openValue;
        const { width, height } = baseImg;
        const squareSize = Math.min(width, height);
        const gridColumns = Math.floor(width / squareSize);
        const gridRows = Math.floor(height / squareSize);
        const updates = util.merge(this.state,{
          dataURL, 
          baseImg, 
          squareSize,
          gridColumns,
          gridRows,
        });
        Object.entries(frameCalcs[updates.viewMode](updates)).forEach(([k,v]) => { updates[k] = v; });
        this.setState(updates);
        });
      this.modals = Dialog.factory({
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          returnInputsOnEsc: true,
          onClose: ({ color, index }) => {
            this.buildGrid(index, color);
          },
        },
      })
    }
    buildGrid(field,value){
      const updates = util.merge(this.state, util.assoc({},field,value));
      const gridCalc = gridCalcs[field];
      if (gridCalc) {
        Object.entries(gridCalc(updates)).forEach(([k,v]) => { updates[k] = v; });
      }
      if (field != "squareSizeInterval") {
        Object.entries(frameCalcs[updates.viewMode](updates)).forEach(([k,v]) => { updates[k] = v; });
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
        onDoubleClick={() => this.update(field, undefined) }
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
              { this.buildGridInitField("gridRows", "Grid Rows", { min: 1 }) }
              { this.buildGridInitField("gridColumns", "Grid Columns", { min: 1 }) }
              { this.buildGridInitField("squareSizeInterval", "Square Size Interval", { min: 0}) }
              <div className="input-group my-2">
                <label htmlFor="squareSize" className="input-group-text">SquareSize:</label>
                <input
                  id="squareSize"
                  name="squareSize"
                  type="number"
                  className="form-control"
                  value={ this.state.squareSize }
                  style={{ width: "4em"}}
                  disabled/>
                <button className="btn btn-secondary" onClick={(e) => { this.setState({ squareSize: this.state.squareSize + this.state.squareSizeInterval }) }}>+</button>
                <button className="btn btn-secondary" onClick={(e) => { this.setState({ squareSize: this.state.squareSize - this.state.squareSizeInterval }) }}>-</button>
              </div>
              { this.buildGridInitField("marginTop", "Margin Top") }
              { this.buildGridInitField("marginLeft", "Margin Left") }
              { this.buildGridInitField("marginBottom", "Margin Bottom") }
              { this.buildGridInitField("marginRight", "Margin Right") }
              { this.buildGridInitField("gridLineWidth", "Grid Line Width", { min: 1 }) }
              { this.buildColorPickerButton("Grid Line Color", "gridLineColor", "my-2", {} ) }
            </div>
            <div className="rpg-box d-flex flex-column m-2">
              <div className="btn-group">
                <button 
                  className={`btn btn-${this.state.viewMode === 'full'?'primary disabled':'secondary'}`}
                  disabled={ this.state.viewMode === 'full' }
                  onClick={(e) => { this.buildGrid("viewMode","full")}}>Full</button>
                <button 
                  className={`btn btn-${this.state.viewMode === 'cell'?'primary disabled':'secondary'}`}
                  disabled={ this.state.viewMode === 'cell' }
                  onClick={(e) => { this.buildGrid("viewMode","cell") }}>Cell</button>
              </div>
              <div className="d-flex justify-content-center">
                { this.buildGridInitField("zoom", "Zoom", { min: 1 }) }
                { this.state.viewMode === 'cell' && this.buildGridInitField("cellIndex", "Cell #", { min: 0, max: (this.gridColumns * this.gridRows) - 1 }) }
              </div>
              <div style={{maxHeight: "23em", maxWidth: "23em", overflow: "scroll"}}>
                <svg width="100%" height="100%" style={{width: `${this.state.zoom}em`, height: `${this.state.zoom}em`}}
                      viewBox={`${this.state.viewX} ${this.state.viewY} ${this.state.viewWidth} ${this.state.viewHeight}`}>
                  <image href={this.state.dataURL} height={this.state.baseImg.height} width={this.state.baseImg.width}/>
                  { Array(this.state.gridRows).fill("").map((_,rowIndex) => {
                    return Array(this.state.gridColumns).fill("").map((_,columnIndex) => {
                      const { x, y } = getGridCoordinates(columnIndex, rowIndex, this.state);

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
                const { dataURL, baseImg, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize, marginTop, marginLeft } = this.state;
                const grid = { gridRows, gridColumns, squareSize, marginTop, marginLeft, marginRight, marginBottom };
                this.close({dataURL, baseImg, grid, gridLineColor, gridLineWidth});
              }}>Accept&nbsp;Grid&nbsp;&amp;&nbsp;Procede</button>
            <button
              className="btn btn-warning"
              onClick={ (e) => { 
                const { dataURL, baseImg } = this.state;
                this.close({ dataURL, baseImg }) 
              }}>Ignore&nbsp;Grid</button>
          </div>
        </>);
      }
    }
  }
});