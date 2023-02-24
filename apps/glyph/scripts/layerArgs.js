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
    movePoly(moveX,moveY) {
      const polyPoints = (this.fromLayer('polyPoints') || []);
      if (polyPoints.length > 0) {
        this.updateLayer('polyPoints',polyPoints.map(([x,y]) => [x+moveX,y+moveY]));
      }
    }

    scalePoly(scaleX,scaleY) {
      const polyPoints = (this.fromLayer('polyPoints') || []);
      if (polyPoints.length > 0) {
        const [sumX,sumY] = polyPoints.reduce(([sumX,sumY],[x,y]) => {
          return [sumX + x, sumY + y];
        }, [0,0]);
        const [avgX,avgY] = [sumX / polyPoints.length, sumY / polyPoints.length];
        this.updateLayer('polyPoints',(this.fromLayer('polyPoints') || []).map(([x,y]) => {
          if (scaleX !== 0) {
            if (x < avgX) {
              x -= scaleX;
            } else if (x > avgX) {
              x += scaleX;
            }
          }
          if (scaleY !== 0) {
            if (y < avgY) {
              y -= scaleY;
            } else if (y > avgY) {
              y += scaleY;
            }
          }
          return [x,y];
        }));
      }
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
              { (this.fromLayer('polyPoints') || []).length >= 1 &&
              <>
                <button title="Move Left" className="btn btn-secondary" onClick={() => {this.movePoly(-1,0)}}><i className="fas fa-arrow-left"/></button>
                <button title="Move Up" className="btn btn-secondary" onClick={() => {this.movePoly(0,-1)}}><i className="fas fa-arrow-up"/></button>
                <button title="Move Down" className="btn btn-secondary" onClick={() => {this.movePoly(0,1)}}><i className="fas fa-arrow-down"/></button>
                <button title="Move Right" className="btn btn-secondary" onClick={() => {this.movePoly(1,0)}}><i className="fas fa-arrow-right"/></button>
                <button title="Shrink" className="btn btn-secondary" onClick={() => {this.scalePoly(-1,-1)}}><i className="fas fa-compress-arrows-alt"/></button>
                <button title="Stretch" className="btn btn-secondary" onClick={() => {this.scalePoly(1,1)}}><i className="fas fa-expand-arrows-alt"/></button>
                <button title="Stretch" className="btn btn-secondary" onClick={() => {this.scalePoly(0,1)}}><i className="fas fa-arrows-alt-v"/></button>
                <button title="Stretch" className="btn btn-secondary" onClick={() => {this.scalePoly(1,0)}}><i className="fas fa-arrows-alt-h"/></button>
              </> }
            </div>
          </>;
        default:
          return <></>
      }
    }
  }
});