namespace('sp.mondrian.LayerArgs',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const buildSimpleInputGroup = function(inputId, inputLabel, layerField, props) {
    return <div className="input-group">
      <label htmlFor={inputId} className="input-group-text">{inputLabel}</label>
      <input
        id={inputId}
        type="number"
        className="form-control"
        style={{width: "4em"}}
        value={ props.fromLayer(layerField) }
        onChange={(e) => props.updateLayer(layerField,parseFloat(e.target.value))}
      />
    </div>;
  }
  return function(props) {
    const SimpleInputGroup = function({inputId, inputLabel, layerField}) {
      return util.buildNumberInputGroup(inputId, inputLabel, () => {
        return props.fromLayer(layerField);
      },(value) => {
        props.updateLayer(layerField,parseFloat(value))
      });
    }
    const [polyPoint, setPolyPoint] = React.useState({x:0,y:0});
    switch (props.fromLayer('type')) {
      case 'rect':
        return <div className="d-flex justify-content-center flex-wrap">
          <SimpleInputGroup inputId="rect-x" inputLabel="X" layerField="rectX"/>
          <SimpleInputGroup inputId="rect-y" inputLabel="Y" layerField="rectY"/>
          <SimpleInputGroup inputId="rect-width" inputLabel="Width" layerField="rectWidth"/>
          <SimpleInputGroup inputId="rect-height" inputLabel="Height" layerField="rectHeight"/>
        </div>;
      case 'circle':
        return <div className="d-flex justify-content-center flex-wrap">
          <SimpleInputGroup inputId="circle-cx" inputLabel="CX" layerField="circleCX"/>
          <SimpleInputGroup inputId="circle-cy" inputLabel="CY" layerField="circleCY"/>
          <SimpleInputGroup inputId="circle-r" inputLabel="R" layerField="circleR"/>
        </div>;
      case 'ellipse':
        return <div className="d-flex justify-content-center flex-wrap">
          <SimpleInputGroup inputId="ellipse-cx" inputLabel="CX" layerField="ellipseCX"/>
          <SimpleInputGroup inputId="ellipse-cy" inputLabel="CY" layerField="ellipseCY"/>
          <SimpleInputGroup inputId="ellipse-rx" inputLabel="RX" layerField="ellipseRX"/>
          <SimpleInputGroup inputId="ellipse-ry" inputLabel="RY" layerField="ellipseRY"/>
        </div>;
      case 'poly':
        return <>
          <div className="d-flex justify-content-center flex-wrap">
            {
              props.fromLayer('args').points.map(([x,y],i) => {
                return <span className="btn btn-secondary">({x},{y})
                  <a
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      const points = Array.from(props.fromLayer('args').points || []);
                      points.splice(i,1);
                      props.updateLayer('args',{ points });
                    }}>X</a>
                </span>;
              })
            }
          </div>
          <div className="d-flex justify-content-center">
            <div className="input-group">
              <label htmlFor="poly-x" className="input-group-text">X:</label>
              <input
                id="poly-x"
                type="number"
                className="form-control"
                style={{width: "4em"}}
                value={ polyPoint.x }
                onChange={(e) => setPolyPoint({ x: parseFloat(e.target.value) })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="poly-y" className="input-group-text">Y:</label>
              <input
                id="poly-y"
                type="number"
                className="form-control"
                style={{width: "4em"}}
                value={ polyPoint.y }
                onChange={(e) => setPolyPoint({ y: parseFloat(e.target.value) })}
              />
            </div>
            <button
              title="Add Layer"
              className="btn btn-success"
              onClick={() => {
                const points = Array.from(props.fromLayer('polyPoints') || []);
                points.push([polyPoint.x,polyPoint.y]);
                props.updateLayer('polyPoints',points);
              }}>+</button>
          </div>
        </>;
      default:
        return <></>
    }
  }
});