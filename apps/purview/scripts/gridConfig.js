namespace("sp.purview.GridConfig",{
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Utilities':'util'
},({ ColorPicker, Colors, util}) => {
  const gcf = function(a, b) {
    if (a === b) {
      return a;
    } else if ( a > b) {
      return gcf(a - b, b);
    } else if ( a < b) {
      return gcf(a, b - a);
    }
  }
  const gridCalcs = {
    gridRows:function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, baseImg: { width, height }}) {
      // calc squareSize from gridRows and gridColumns
      return { squareSize, gridRows, gridColumns }
    },
    gridColumns:function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, baseImg: { width, height }}) {
      // calc squareSize from gridRows and gridColumns
      return { squareSize, gridRows, gridColumns }
    },
    squareSize:function({ squareSize, gridRows, gridColumns, marginLeft, marginTop, baseImg: { width, height }}) {
      // calc gridColumns and gridRows from squareSize
      return { squareSize, gridRows, gridColumns }
    }
  }
  const calcFrame = function({}) {
    // todo 
  }
  const updateSetter = function(updates) {
    return (([key,value]) => { updates[key] = value; })
  }
  return class extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
      this.close = props.close;
      props.setOnOpen(({ dataURL, baseImg }) => {
        const { width, height } = baseImg;
        const squareSize = gcf(width, height);
        const gridColumns = width / squareSize;
        const gridRows = height / squareSize;
        this.setState({ 
          dataURL, 
          baseImg, 
          grid: { 
            squareSize,
            gridColumns,
            gridRows,
            marginLeft: 0,
            marginTop: 0,
            gridLineWidth: 3,
            gridLineColor: "#FF0000",
          } 
        });
      });
      this.modals = Dialog.factory({
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose: ({ color, index }) => {
            this.buildGrid(index, color);
          },
        },
      })
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
    getGridCoordinates(columnIndex, rowIndex) {
      return {
        x: columnIndex * this.state.squareSize + this.state.marginLeft,
        y: rowIndex * this.state.squareSize + this.state.marginTop
      }
    }
    buildGrid(field,value){
      const updates = util.merge(this.state, util.assoc({},field,value));
      const gridCalc = gridCalcs[field];
      if (gridCalc) {
        Object.entries(gridCalc(updates)).forEach(updateSetter(updates));
      }
      Object.entries(calcFrame(updates)).forEach(updateSetter(updates));
      this.setState(util.merge(updates,frame));
    }
    setInitGridViewMode(viewMode) {
      this.buildGrid("viewMode",viewMode);
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
          defaultValue={ this.state.initGrid[field] }
          style={{ width: "4em"}}
          onChange={(e) => this.buildGrid(field,e.target.value)}/>
      </div>;
    }
    render() {
      return (<>
        <div className="d-flex justify-content-center">
          <div className="rpg-box d-flex flex-column m-2">
            { this.buildGridInitField("gridRows", "Grid Rows", { min: 1 }) }
            { this.buildGridInitField("gridColumns", "Grid Columns", { min: 1 }) }
            { this.buildGridInitField("squareSize", "Square Size", { min: 1 }) }
            { this.buildGridInitField("marginTop", "Margin Top", { min: 0 }) }
            { this.buildGridInitField("marginLeft", "Margin Left", { min: 0 }) }
            { this.buildGridInitField("gridLineWidth", "Grid Line Width", { min: 1 }) }
            { this.buildColorPickerButton("Grid Line Color", "gridLineColor", "my-2", {}, "gridColorPicker", (field) => this.state.initGrid[field], (field,value) => this.buildGrid(field,value)) }
          </div>
          <div className="rpg-box d-flex flex-column m-2">
            <div className="btn-group">
              <button 
                className={`btn btn-${this.state.viewMode === 'full'?'primary disabled':'secondary'}`}
                disabled={ this.state.viewMode === 'full' }
                onClick={(e) => { this.setInitGridViewMode("full")}}>Full</button>
              <button 
                className={`btn btn-${this.state.viewMode === 'cell'?'primary disabled':'secondary'}`}
                disabled={ this.state.viewMode === 'cell' }
                onClick={(e) => { this.setInitGridViewMode("cell") }}>Cell</button>
            </div>
            { this.state.viewMode === 'full' && this.buildGridInitField("zoom", "Zoom", { min: 1 }) }
            { this.state.viewMode === 'cell' && this.buildGridInitField("cellIndex", "Cell #", { min: 1 }) }
            <div>
              <svg width="100%" height="100%" style={{width: "20em", height: "20em"}}
                    viewBox={`${this.state.x} ${this.state.y} ${this.state.width} ${this.state.height}`}>
                <image href={this.state.dataURL} height={this.state.baseImg.height} width={this.state.baseImg.width}/>
                { Array(this.state.gridRows).fill("").map((_,rowIndex) => {
                  return Array(this.state.gridColumns).fill("").map((_,columnIndex) => {
                    const { x, y } = this.getGridCoordinates(columnIndex, rowIndex);
                    return <rect x={x} y={y} width={this.state.squareSize} height={this.state.squareSize} fill="none" stroke={this.state.gridLineColor} strokeWidth={this.state.gridLineWidth} />;
                  })
                }) }
              </svg>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
        <button
            className={`btn btn-${this.state.isValid?'success':'secondary disabled'}`}
            disabled={!this.state.isValid}
            onClick={ (e) => {
              const { dataURL, baseImg, gridLineColor, gridLineWidth, gridRows, gridColumns, squareSize, marginTop, marginLeft } = this.state;
              const grid = { gridRows, gridColumns, squareSize, marginTop, marginLeft };
              this.close({dataURL, baseImg, grid, gridLineColor, gridLineWidth});
            }}>Accept&nbsp;Grid&nbsp;&amp;&nbsp;Procede</button>
          <button
            className="btn btn-warning"
            onClick={ (e) => this.close({ dataURL, baseImg }) }>Ignore&nbsp;Grid</button>
        </div>
      </>);
    }
  }
});