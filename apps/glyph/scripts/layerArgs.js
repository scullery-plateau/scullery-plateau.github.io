namespace('sp.glyph.LayerArgs',{
  'sp.common.Utilities':'util'
},({ util }) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      const { fromLayer, updateLayer } = props;
      this.fromLayer = fromLayer;
      this.updateLayer = updateLayer;
      this.state = {x:0,y:0};
    }
    buildSimpleInputGroup (inputId, inputLabel, layerField) {
      return util.buildNumberInputGroup(inputId, inputLabel, {style:{width: "4em"}},() => {
        return this.fromLayer(layerField);
      },(value) => {
        this.updateLayer(layerField,parseFloat(value))
      });
    }
    buildPolyPointInputGroup (inputId, inputLabel, coordName) {
      return util.buildNumberInputGroup(inputId, inputLabel, {style:{width: "4em"}},() => {
        return this.state[coordName]
      },(value) => {
        const parsed = parseFloat(value);
        if (!isNaN(this.state.i)) {
          const polyPoints = Array.from(this.fromLayer('polyPoints') || []);
          const [x,y] = polyPoints[i];
          const point = {x,y};
          point[coordName] = parsed;
          polyPoints[i] = [point.x,point.y];
          this.updateLayer('polyPoints',polyPoints);
        }
        this.setState(util.assoc({},coordName,parsed));
      });
    }
    clearState() {
      this.setState({x:0,y:0,i:undefined});
    }
    render() {
      switch (this.fromLayer('type')) {
        case 'rect':
          return <>
            <div className="d-flex justify-content-center">
              { this.buildSimpleInputGroup('rect-x','X','rectX') }
              { this.buildSimpleInputGroup('rect-y','Y','rectY') }
            </div>
            <div className="d-flex justify-content-center">
              { this.buildSimpleInputGroup('rect-width','Width','rectWidth') }
              { this.buildSimpleInputGroup('rect-height','Height','rectHeight') }
            </div>
          </> ;
        case 'circle':
          return <div className="d-flex justify-content-center">
            { this.buildSimpleInputGroup('circle-cx','CX','circleCX') }
            { this.buildSimpleInputGroup('circle-cy','CY','circleCY') }
            { this.buildSimpleInputGroup('circle-r','R','circleR') }
          </div>;
        case 'ellipse':
          return <>
            <div className="d-flex justify-content-center">
              { this.buildSimpleInputGroup('ellipse-cx','CX','ellipseCX') }
              { this.buildSimpleInputGroup('ellipse-cy','CY','ellipseCY') }
            </div>
            <div className="d-flex justify-content-center">
              { this.buildSimpleInputGroup('ellipse-rx','RX','ellipseRX') }
              { this.buildSimpleInputGroup('ellipse-ry','RY','ellipseRY') }
            </div>
          </>;
        case 'poly':
          return <>
            <div className="d-flex justify-content-center flex-wrap">
              {
                (this.fromLayer('polyPoints') || []).map(([x,y],i) => {
                  return <button
                    className={`btn ${this.state.i === i?"btn-info":"btn-secondary"}`}
                    onClick={() => {
                      if (this.state.i === i) {
                        this.clearState();
                      } else {
                        this.setState({x,y,i});
                      }
                    }}
                    onDoubleClick={() => {
                      const polyPoints = Array.from(this.fromLayer('polyPoints') || []);
                      polyPoints.splice(i,1);
                      this.updateLayer('polyPoints',polyPoints);
                      this.clearState();
                    }}
                  >({x},{y})</button>;
                })
              }
            </div>
            <div className="d-flex justify-content-center">
              { this.buildPolyPointInputGroup('poly-x','X','x') }
              { this.buildPolyPointInputGroup('poly-y','Y','y') }
              { isNaN(this.state.i) &&
                <button
                  title="Add Layer"
                  className="btn btn-success"
                  onClick={() => {
                    const points = Array.from(this.fromLayer('polyPoints') || []);
                    points.push([this.state.x,this.state.y]);
                    this.updateLayer('polyPoints',points);
                  }}>+</button>
              }
            </div>
          </>;
        default:
          return <></>
      }
    }
  }
});