namespace("sp.yoga-proto.PoseGallery",{
  "sp.yoga-proto.PoseData": "PoseData",
  "sp.common.Utilities":"util",
},({ PoseData, util }) => {
  const applyUpdates = function(state, updates) {
    updates = updates || {};
    // todo
    return util.merge(state, updates);
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = applyUpdates(PoseData);
    }
    update(field, value) {
      this.setState(applyUpdates(this.state,util.assoc({},field,value)));
    }
    buildField(label, id) {
      return <div className="input-group">
        <label for={id} className="input-label">{label}</label>
        <input
          id={id}
          type="number"
          className="form-control"
          min={0}
          value={ this.state[id] }
          onChange={(e) => this.update(id,parseInt(e.target.value))}
          />
        </div>;
    }
    render(){
      const height = this.state.imgDim.height - this.state.topMargin - this.state.bottomMargin;
      const width = this.state.imgDim.width - (this.state.sideMargin * 2);
      return <>
        <h2>Pose Gallery</h2>
        <div className="d-flex align-content-center">
          <div className="d-flex w-50 flex-column bg-primary rounded">
            { this.buildField("Top Margin", "topMargin") } 
            { this.buildField("Bottom Margin", "bottomMargin") } 
            { this.buildField("Side Margin", "sideMargin") } 
          </div>
          <div className="w-50">
            <svg width="100%" height="80%" viewBox="0 0 995 1500">
              <image href="./assets/pose-index.jpg"/>
              <rect x={this.state.sideMargin} y={this.state.topMargin} width={width} height={height} fill="none" stroke="red" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </>;
    }
  }
});