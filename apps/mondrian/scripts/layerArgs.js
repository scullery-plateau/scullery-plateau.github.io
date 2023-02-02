namespace('sp.mondrian.LayerArgs',{

},({}) => {
  return function(props) {
    const [polyPoint, setPolyPoint] = React.useState({x:0,y:0});
    switch (props.fromLayer('type')) {
      case 'rect':
        return <div className="d-flex justify-content-center flex-wrap">
          <div className="input-group">
            <label htmlFor="rect-x" className="input-group-text">X:</label>
            <input
              id="rect-x"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('rect-x') }
              onChange={(e) => props.updateLayer('rect-x',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="rect-y" className="input-group-text">Y:</label>
            <input
              id="rect-y"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('rect-y') }
              onChange={(e) => props.updateLayer('rect-y',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="rect-width" className="input-group-text">Width:</label>
            <input
              id="rect-width"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('rect-width') }
              onChange={(e) => props.updateLayer('rect-width',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="rect-height" className="input-group-text">Height:</label>
            <input
              id="rect-height"
              type="number"
              className="form-control"
              style={{height: "4em"}}
              value={ props.fromLayer('rect-height') }
              onChange={(e) => props.updateLayer('rect-height',parseFloat(e.target.value))}
            />
          </div>
        </div>;
      case 'circle':
        return <div className="d-flex justify-content-center flex-wrap">
          <div className="input-group">
            <label htmlFor="circle-cx" className="input-group-text">CX:</label>
            <input
              id="circle-cx"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('circle-cx') }
              onChange={(e) => props.updateLayer('circle-cx',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="circle-cy" className="input-group-text">CY:</label>
            <input
              id="circle-cy"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('circle-cy') }
              onChange={(e) => props.updateLayer('circle-cy',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="circle-r" className="input-group-text">R:</label>
            <input
              id="circle-r"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('circle-r') }
              onChange={(e) => props.updateLayer('circle-r',parseFloat(e.target.value))}
            />
          </div>
        </div>;
      case 'ellipse':
        return <div className="d-flex justify-content-center flex-wrap">
          <div className="input-group">
            <label htmlFor="ellipse-cx" className="input-group-text">CX:</label>
            <input
              id="ellipse-cx"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('ellipse-cx') }
              onChange={(e) => props.updateLayer('ellipse-cx',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="ellipse-cy" className="input-group-text">CY:</label>
            <input
              id="ellipse-cy"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('ellipse-cy') }
              onChange={(e) => props.updateLayer('ellipse-cy',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="ellipse-rx" className="input-group-text">RX:</label>
            <input
              id="ellipse-rx"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('ellipse-rx') }
              onChange={(e) => props.updateLayer('ellipse-rx',parseFloat(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label htmlFor="ellipse-ry" className="input-group-text">RY:</label>
            <input
              id="ellipse-ry"
              type="number"
              className="form-control"
              style={{width: "4em"}}
              value={ props.fromLayer('ellipse-ry') }
              onChange={(e) => props.updateLayer('ellipse-ry',parseFloat(e.target.value))}
            />
          </div>
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
                      props.splice(i,1);
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
                const points = Array.from(props.fromLayer('args').points || []);
                points.push([polyPoint.x,polyPoint.y]);
                props.updateLayer('args',{ points });
              }}>+</button>
          </div>
        </>;
      default:
        return <></>
    }
  }
});