namespace('sp.mondrian.MondrianSVG',{
  'sp.common.Utilities':'util'
},({ util }) => {
  const layerDefaults = { strokeWidth: 0 };
  const shapes = {
    rect:{
      init:function(defaults) {
        return util.merge(defaults,{type:"rect"});
      },
      render:function(layer) {
        return <rect x={layer.rectX} y={layer.rectY} width={layer.rectWidth} height={layer.rectHeight} fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></rect>;
      },
      draw:function(layer) {
        const path = new Path2D();
        path.rect(layer.rectX || 0,layer.rectY || 0,layer.rectWidth || 0,layer.rectHeight || 0);
        return path;
      }
    },
    circle:{
      init:function(defaults) {
        return util.merge(defaults,{type:"circle",circleCX:0,circleCY:0,circleR:20});
      },
      render:function(layer) {
        return <circle cx={layer.circleCX} cy={layer.circleCY} r={layer.circleR}  fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></circle>;
      },
      draw:function(layer) {
        const path = new Path2D();
        path.arc(layer.circleCX || 0,layer.circleCY || 0,layer.circleR || 0, 0, 2 * Math.PI);
        path.closePath();
        return path;
      }
    },
    ellipse:{
      init:function(defaults) {
        return util.merge(defaults,{type:"ellipse"});
      },
      render:function(layer) {
        return <ellipse cx={layer.ellipseCX} cy={layer.ellipseCY} rx={layer.ellipseRX} ry={layer.ellipseRY} fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></ellipse>;
      },
      draw:function(layer) {
        const path = new Path2D();
        path.ellipse(layer.ellipseCX || 0, layer.ellipseCY || 0, layer.ellipseRX || 0, layer.ellipseRY || 0, 0, 0, 2 * Math.PI);
        return path;
      }
    },
    poly:{
      init:function(defaults) {
        return util.merge(defaults,{ type:"poly", polyPoints: [] });
      },
      render:function(layer) {
        if(Array.isArray(layer.polyPoints) && layer.polyPoints.length >= 3) {
          return <polygon points={layer.polyPoints.map((p) => p.join(',')).join(' ')}  fill={layer.fill || 'none'} stroke={layer.stroke || 'none'} strokeWidth={layer.strokeWidth || 0}></polygon>;
        }
      },
      draw:function(layer) {
        const path = new Path2D();
        const [firstX,firstY] = layer.polyPoints[0];
        const rest = layer.polyPoints.slice(1);
        path.moveTo(firstX || 0, firstY || 0);
        rest.forEach(([x,y]) => {
          path.lineTo(x || 0, y || 0);
        })
        path.closePath();
        return path;
      }
    }
  }
  const render = function(layer) {
    const shape = shapes[layer.type];
    if (shape) {
      return shape.render(layer);
    }
  }
  const draw = function(ctx,layer) {
    const shape = shapes[layer.type];
    if (shape) {
      console.log({ msg: `draw ${layer.type}`, layer});
      ctx.fillStyle = layer.fill;
      ctx.strokeStyle = layer.stroke;
      ctx.lineWidth = layer.strokeWidth || 0;
      const path = shape.draw(layer);
      if (layer.fill) {
        ctx.fill(path);
      }
      if (layer.stroke && layer.strokeWidth > 0) {
        ctx.stroke(path);
      }
    }
  }
  const newSchematic = function() {
    return {
      size: {
        minX: 0, minY: 0, maxX: 100, maxY:100,
      },
      layers:[],
      grid:{
        size:10,
        lineWidth:1,
        style:"solid"
      }
    };
  }
  const newLayer = function(type) {
    const shape = shapes[type];
    if (shape) {
      return shape.init(layerDefaults);
    } else {
      return util.merge(layerDefaults);
    }
  }
  const getDim = function(schematic) {
    return {
      width: schematic.size.maxX - schematic.size.minX,
      height: schematic.size.maxY - schematic.size.minY
    };
  };
  const MondrianSVG = function({ schematic }) {
    const { width, height } = getDim(schematic);
    return <svg width="100%" height="80%" viewBox={`${schematic.size.minX} ${schematic.size.minY} ${width} ${height}`}>
      <rect x={schematic.size.minX} y={schematic.size.minY} width={width} height={height} fill="#999999" stroke="none"/>
      { schematic.layers.map((layer) => {
        return render(layer);
      })}
      <rect x={schematic.size.minX} y={schematic.size.minY} width={width} height={height} fill="none" stroke="black" strokeWidth={2}/>
    </svg>;
  }
  MondrianSVG.drawCanvasBase64 = function(schematic,callback) {
    const { width, height } = getDim(schematic);
    const { ctx, canvas } = util.getCanvasAndContext("canvas");
    canvas.width = width;
    canvas.height = height;
    schematic.layers.forEach((layer) => {
      draw(ctx,layer);
    });
    callback(canvas.toDataURL());
  }
  MondrianSVG.newSchematic = newSchematic;
  MondrianSVG.newLayer = newLayer;
  return MondrianSVG;
});
