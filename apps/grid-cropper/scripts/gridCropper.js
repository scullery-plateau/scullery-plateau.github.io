namespace("sp.grid-cropper.GridCropper", {
  'sp.common.ColorPicker':'ColorPicker',
  'sp.common.Colors':'Colors',
  'sp.common.Dialog':'Dialog',
  'sp.common.EditMode':'EditMode',
  'sp.common.Header':'Header',
  'sp.common.LoadFile':'LoadFile',
  'sp.common.Utilities':'util',
  'sp.grid-cropper.ImageDownload':'ImageDownload'
}, ({ ColorPicker, Colors, Dialog, EditMode, Header, LoadFile, util, ImageDownload }) => {
  Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
  const about = [];
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
    constructor(props) {
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
      this.modals = Dialog.factory({
        colorPicker: {
          componentClass: ColorPicker,
          attrs: { class: 'rpg-box text-light w-75' },
          returnInputsOnEsc: true,
          onClose: ({ color, index }) => {
            this.buildGrid(index, color);
          },
        },
        imageDownload: {
          componentClass: ImageDownload,
          attrs: { class: 'rpg-box text-light w-75' },
        }
      });
      this.menuItems = [{
        id: 'about',
        label: 'About',
        callback: () => {
          Dialog.alert({ title: "Grid Cropper", lines: about });
        }
      }];
    }
    loadMapImage() {
      LoadFile(
        false,
        'dataURL',
        (dataURL) => {
          util.initImageObj(dataURL,(baseImg) => {
            EditMode.enable();
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
        },
        (filename, error) => {
          console.log({ filename, error });
          alert(filename + ' failed to load. See console for error.');
        }
      );
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
        onDoubleClick={() => this.buildGrid(field, undefined) }
        onContextMenu={(e) => {
          e.preventDefault();
          this.buildGrid(field,undefined);
        }}>{label}</button>;
    }
    buildGridInitField(field, label, options) {
      options = options || {};
      return <div className="form-group my-2">
        <label htmlFor={field} className="form-label">{label.split(" ").join("\xa0")}:</label>
        <input
          id={field}
          name={field}
          type="number"
          className="form-control"
          min={ options.min }
          step={ options.step }
          style={{ width: "10em" }}
          value={ this.state[field] }
          onChange={(e) => this.buildGrid(field,parseFloat(e.target.value))}/>
      </div>;
    }
    render() {
      return (<>
        <Header menuItems={this.menuItems} appTitle={'Grid Cropper'} />
        { !this.state.dataURL && 
          (<>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={() => this.loadMapImage()}>Load Map Image</button>
            </div>
          </>) }
        { this.state.dataURL && 
          (<>
            <div className="row justify-content-center">
              <div className="col-7">
                <div className="rpg-box m-2 row justify-content-center">
                  <div className="col-4">
                    { this.buildGridInitField("gridRows", "Grid Rows", { min: 1 }) }
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("gridColumns", "Grid Columns", { min: 1 }) }
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("squareSizeInterval", "Square Size Interval", { min: 0}) }
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("marginTop", "Margin Top") }
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("marginLeft", "Margin Left") }
                  </div>
                  <div className="col-4">
                    <div className="form-group my-2">
                      <label htmlFor="squareSize" className="form-label">SquareSize:</label>
                      <div className="d-flex justify-content-left">
                        <input id="squareSize" name="squareSize" type="number" className="form-control" style={{ width: "6em" }} value={ this.state.squareSize } disabled/>
                        <button className="btn btn-secondary" onClick={() => { this.setState({ squareSize: this.state.squareSize + this.state.squareSizeInterval }) }}>+</button>
                        <button className="btn btn-secondary" onClick={() => { this.setState({ squareSize: this.state.squareSize - this.state.squareSizeInterval }) }}>-</button>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("marginBottom", "Margin Bottom") }
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("marginRight", "Margin Right") }
                  </div>
                  <div className="col-4">
                    { this.buildGridInitField("gridLineWidth", "Grid Line Width", { min: 1 }) }
                  </div>
                  <div className="col-6">
                    { this.buildColorPickerButton("Background Color", "bgColor", "my-2 w-100", {} ) }
                  </div>
                  <div className="col-6">
                    { this.buildColorPickerButton("Grid Line Color", "gridLineColor", "my-2 w-100", {} ) }
                  </div>
                </div>
              </div>
              <div className="col-5">
                <div className="rpg-box m-2">
                  <div className="row">
                    <div className="col">
                      <div className="btn-group w-100">
                        <button 
                          className={`btn btn-${this.state.viewMode === 'full'?'primary disabled':'secondary'}`}
                          disabled={ this.state.viewMode === 'full' }
                          onClick={(e) => { this.buildGrid("viewMode","full")}}>Full</button>
                        <button 
                          className={`btn btn-${this.state.viewMode === 'cell'?'primary disabled':'secondary'}`}
                          disabled={ this.state.viewMode === 'cell' }
                          onClick={(e) => { this.buildGrid("viewMode","cell") }}>Cell</button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      { this.buildGridInitField("zoom", "Zoom", { min: 1 }) }
                    </div>
                    <div className="col-6">
                      { this.state.viewMode === 'cell' && this.buildGridInitField("cellIndex", "Cell #", { min: 0, max: (this.gridColumns * this.gridRows) - 1 }) }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="w-100 overflow-scroll" style={{ maxHeight: "22em" }}>
                        <svg width="100%" height="100%" style={{width: `${this.state.zoom}em`, height: `${this.state.zoom}em`}}
                              viewBox={`${this.state.viewX} ${this.state.viewY} ${this.state.viewWidth} ${this.state.viewHeight}`}>
                          <rect x={this.state.viewX} y={this.state.viewY} width={this.state.viewWidth} height={this.state.viewHeight} fill={this.state.bgColor}/>
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
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success"
                onClick={ () => {
                  this.modals.imageDownload.open({
                    cropData: this.state,
                    defaultFilename: "gridCropper"
                  });
                }}>Download&nbsp;Cropped&nbsp;Image</button>
            </div>
          </>)
        }
      </>);
    }
  }
});