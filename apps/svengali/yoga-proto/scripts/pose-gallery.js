namespace("sp.yoga-proto.PoseGallery",{
  "sp.yoga-proto.PoseData": "PoseData",
  "sp.common.Utilities":"util",
},({ PoseData, util }) => {
  const applyUpdates = function(state, updates) {
    const newState = util.merge(state, updates || {});
    const height = newState.imgDim.height - newState.topMargin - newState.bottomMargin;
    const width = newState.imgDim.width - (newState.sideMargin * 2);
    const heightInterval = height / newState.rowCount
    newState.boxWidth = Math.min(width / newState.maxCellCount, newState.boxWidth);
    newState.rowHeight = Math.min(heightInterval, newState.rowHeight);
    newState.rows = Array(newState.rowCount).fill("").map((_, index) => {
      return {
        top: (heightInterval * index) + newState.topMargin,
        count: newState.maxCellCount
      };
    });
    return newState;
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = applyUpdates(PoseData, props);
    }
    componentDidMount() {
      if (!this.state.baseImg) {
        util.initImageObj(this.state.imgUrl,(baseImg) => {
          this.setState({ baseImg });
        });
      }
    }
    update(field, value) {
      this.setState(applyUpdates(this.state,util.assoc({},field,value)));
    }
    buildField(label, id, options) {
      options = options || {}
      return <div className="input-group p-2 flex-shrink-1" style={{ width: "33%"}}>
        <label htmlFor={id} className="input-group-text">{label}</label>
        <input
          id={id}
          type="number"
          className="form-control"
          min={0}
          max={options.max}
          value={ options.value || this.state[id] }
          onChange={(e) => this.update(id,parseInt(e.target.value))}
          />
        </div>;
    }
    updateRow(field, value) {
      const rows = Array.from(this.state.rows);
      rows[this.state.selectedRow][field] = value;
      this.setState({ rows });
    }
    buildRowField(label, id, options) {
      options = options || {}
      return <div className="input-group p-2 flex-shrink-1 w-50">
        <label htmlFor={id} className="input-group-text">{label}</label>
        <input
          id={id}
          type="number"
          className="form-control"
          min={0}
          max={ options.max }
          value={ options.value || this.state.rows[this.state.selectedRow][id] }
          onChange={(e) => this.updateRow(id, parseInt(e.target.value))}
          />
        </div>;
    }
    render(){
      const height = this.state.imgDim.height - this.state.topMargin - this.state.bottomMargin;
      const width = this.state.imgDim.width - (this.state.sideMargin * 2);
      const boxWidth = width / this.state.maxCellCount;
      const rowHeight = height / this.state.rowCount;
      const lefts = this.state.rows.reduce((outVal, { count }) => {
        outVal[count] = true;
        return outVal;
      }, {});
      Object.keys(lefts).forEach((count) => {
        lefts[count] = Array(parseInt(count)).fill("").map((_, index) => {
          const halfSpan = width / (count * 2);  
          return (halfSpan * (index * 2 + 1)) - Math.floor(this.state.boxWidth / 2) + this.state.sideMargin;
        });
      });
      console.log({ state: this.state });
      const thumbnails = this.state.rows.reduce((outVal, { top, count }, rowIndex) => {
        const rowLefts = lefts[count];
        return outVal.concat(rowLefts.map((left, columnIndex) => {
          return { top, left, rowIndex, columnIndex, count };
        }));
      }, []);
      const firsts = thumbnails.reduce((outVal, { rowIndex }, index) => {
        if ((typeof outVal[rowIndex] !== "number")) {
          outVal[rowIndex] = index;
        }
        return outVal;
      }, {});
      console.log({ thumbnails });
      const selectedThumbnail = Math.min(this.state.selectedThumbnail, thumbnails.length - 1);
      const selectedImg = thumbnails[selectedThumbnail];
      const selectedCanvasUrl = this.state.baseImg?util.drawImageInCanvas(this.state.baseImg,selectedImg.left,selectedImg.top,this.state.boxWidth,this.state.rowHeight,this.state.canvasId):undefined;
      return <>
        <h2>Pose Gallery</h2>
        { this.state.baseImg &&
          <div className="d-flex align-content-center">
            <div className="w-50 bg-primary rounded m-3 p-1">
              <div className="d-flex flex-column align-content-center">
                <div className="d-inline-flex flex-wrap align-content-center">
                  { this.buildField("Top Margin", "topMargin") } 
                  { this.buildField("Bottom Margin", "bottomMargin") } 
                  { this.buildField("Side Margin", "sideMargin") } 
                  { this.buildField("Box Width", "boxWidth", { 
                      max: boxWidth,
                      value: Math.min(this.state.boxWidth, boxWidth)
                    }) } 
                  { this.buildField("Row Height", "rowHeight", {
                      max: rowHeight,
                      value: Math.min(this.state.rowHeight, rowHeight)
                    }) }
                </div>
                <div className="input-group p-2 flex-shrink-1">
                  <label htmlFor="selectedRow" className="input-group-text">Selected Row</label>
                  <select
                    id="selectedRow"
                    className="form-select"
                    value={ this.state.selectedRow }
                    onChange={(e) => this.setState({ 
                      selectedRow: parseInt(e.target.value),
                      selectedThumbnail: firsts[parseInt(e.target.value)]
                    })}>
                    { this.state.rows.map(({top, count}, index) => {
                      return <option value={ index }>{index}: top={top}, count={count}</option>
                    }) }
                  </select>
                </div>
                <div className="d-inline-flex flex-wrap align-content-center">
                  { this.buildRowField("Selected Row Top", "top") } 
                  { this.buildRowField("Selected Row Cell Count", "count", {
                    max: this.state.maxCellCount
                  }) } 
                </div>
                <div className="input-group p-2 flex-shrink-1 w-50">
                  <label htmlFor="selectedThumbnail" className="input-group-text">Selected Thumbnail</label>
                  <input
                    id="selectedThumbnail"
                    type="number"
                    className="form-control"
                    min={0}
                    max={thumbnails.length - 1}
                    value={ selectedThumbnail }
                    onChange={(e) => this.setState({ 
                      selectedThumbnail: parseInt(e.target.value),
                      selectedRow: thumbnails[parseInt(e.target.value)].rowIndex
                    })}
                    />
                </div>
                <div className="w-100 h-50">
                  <a href={selectedCanvasUrl} download={`pose${selectedImg.columnIndex}x${selectedImg.rowIndex}`}>
                    <img src={selectedCanvasUrl} width="100%" height="100%"/>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-50 m-3 bg-secondary rounded p-3">
              <svg width="100%" height="80%" viewBox="0 0 995 1500">
                <image href={this.state.imgUrl}/>
                <rect x={this.state.sideMargin} y={this.state.topMargin} width={width} height={height} fill="none" stroke="red" strokeWidth="2"/>
                { thumbnails.map(({ top, left }) => {
                    return <rect x={left} y={top} width={this.state.boxWidth} height={this.state.rowHeight} fill="none" stroke="red" strokeWidth="2"/>
                  }) }
              </svg>
            </div>
          </div>
        }
      </>;
    }
  }
});