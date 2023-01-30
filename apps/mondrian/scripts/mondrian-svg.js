namespace('sp.mondrian.MondrianSVG',{},() => {
  const shapes = {
    // todo: args, render, draw
    rect:{},
    circle:{},
    ellipse:{},
    polygon:{}
  }
  const newSchematic = function() {
    return { minX: 0, minY: 0, maxX: 100, maxY:100, layers:[] };
  }
  const newLayer = function() {
    // todo
    return {  }
  }
  const getDim = function(schematic) {
    return {
      width: schematic.maxX - schematic.minX,
      height: schematic.maxY - schematic.minY
    }
  }
  const MondrianSVG = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.schematic;
    }
    render() {
      const { width, height } = getDim(this.state);
      return <svg width={width} height={height} viewBox={`${this.state.minX} ${this.state.minY} ${width} ${height}`}>
        { this.state.layers.map((layer) => {
          return shapes[layer.type].render(layer);
        })}
      </svg>
    }
  }
  MondrianSVG.drawCanvasBase64 = function(schematic,callback) {
    const { width, height } = getDim(schematic)
    // todo draw in canvas and call callback with base 64 URL
  }
  MondrianSVG.newSchematic = newSchematic;
  MondrianSVG.newLayer = newLayer;
  return MondrianSVG;
});
